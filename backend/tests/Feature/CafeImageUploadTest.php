<?php

namespace Tests\Feature;

use App\Models\Vendor;
use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CafeImageUploadTest extends TestCase
{
    use RefreshDatabase;

    private $vendor;
    private $token;
    private $cafe;

    public function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('public');

        // Create a vendor account
        $this->vendor = Vendor::factory()->create([
            'email' => 'vendor@test.com',
            'password' => bcrypt('password123'),
        ]);

        // Get authentication token
        $response = $this->postJson('/api/vendor/login', [
            'email' => 'vendor@test.com',
            'password' => 'password123',
        ]);

        $this->token = $response->json('token');

        // Create a cafe
        $this->cafe = Cafe::create([
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Test Cafe',
            'cafe_description' => 'Test Description',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'TS',
            'pincode' => '123456',
            'latitude' => 12.9716,
            'longitude' => 77.5946,
        ]);
    }

    /**
     * Test successful image upload to existing cafe
     */
    public function test_upload_single_image_success()
    {
        $file = UploadedFile::fake()->image('cafe1.jpg', 800, 600);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => [$file],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Images uploaded successfully',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'cafe' => [
                    'id',
                    'vendor_id',
                    'cafe_name',
                    'images' => [
                        '*' => [
                            'id',
                            'cafe_id',
                            'image_path',
                            'image_url',
                            'is_primary',
                        ]
                    ]
                ]
            ]);

        // Verify image was stored
        $this->assertCount(1, $response->json('cafe.images'));
    }

    /**
     * Test upload multiple images
     */
    public function test_upload_multiple_images_success()
    {
        $files = [
            UploadedFile::fake()->image('cafe1.jpg', 800, 600),
            UploadedFile::fake()->image('cafe2.jpg', 800, 600),
            UploadedFile::fake()->image('cafe3.png', 800, 600),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => $files,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Images uploaded successfully',
            ]);

        // Verify all images were stored
        $this->assertCount(3, $response->json('cafe.images'));
    }

    /**
     * Test upload without images
     */
    public function test_upload_without_images()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', []);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'errors' => [
                    'images',
                ]
            ]);
    }

    /**
     * Test upload with invalid file format
     */
    public function test_upload_invalid_file_format()
    {
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => [$file],
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'errors' => [
                    'images.0',
                ]
            ]);
    }

    /**
     * Test upload file too large
     */
    public function test_upload_file_too_large()
    {
        $file = UploadedFile::fake()->image('large.jpg')->size(3000); // 3000 KB = ~3 MB

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => [$file],
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'errors' => [
                    'images.0',
                ]
            ]);
    }

    /**
     * Test upload without authentication token
     */
    public function test_upload_without_token()
    {
        $file = UploadedFile::fake()->image('cafe1.jpg', 800, 600);

        $response = $this->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => [$file],
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test upload to non-existent cafe
     */
    public function test_upload_to_non_existent_cafe()
    {
        $file = UploadedFile::fake()->image('cafe1.jpg', 800, 600);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/9999/images/upload', [
            'images' => [$file],
        ]);

        $response->assertStatus(500);
    }

    /**
     * Test delete cafe image
     */
    public function test_delete_cafe_image_success()
    {
        // First upload an image
        $file = UploadedFile::fake()->image('cafe1.jpg', 800, 600);

        $uploadResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/vendor/cafe/' . $this->cafe->id . '/images/upload', [
            'images' => [$file],
        ]);

        $imageId = $uploadResponse->json('cafe.images.0.id');

        // Now delete the image
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->delete('/api/vendor/cafe/' . $this->cafe->id . '/image/' . $imageId);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);
    }

    /**
     * Test delete non-existent image
     */
    public function test_delete_non_existent_image()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->delete('/api/vendor/cafe/' . $this->cafe->id . '/image/9999');

        $response->assertStatus(500);
    }

    /**
     * Test delete image without token
     */
    public function test_delete_image_without_token()
    {
        $response = $this->delete('/api/vendor/cafe/' . $this->cafe->id . '/image/1');

        $response->assertStatus(401);
    }
}
