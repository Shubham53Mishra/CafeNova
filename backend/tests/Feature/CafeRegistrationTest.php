<?php

namespace Tests\Feature;

use App\Models\Vendor;
use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CafeRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private $vendor;
    private $token;

    public function setUp(): void
    {
        parent::setUp();
        
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
    }

    /**
     * Test successful cafe registration
     */
    public function test_cafe_registration_success()
    {
        $cafeData = [
            'cafe_name' => 'Coffee Paradise',
            'cafe_description' => 'Best coffee in town',
            'address' => '123 Main Street',
            'city' => 'New York',
            'state' => 'NY',
            'pincode' => '100001',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Cafe registered successfully',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'cafe' => [
                    'id',
                    'vendor_id',
                    'cafe_name',
                    'cafe_description',
                    'address',
                    'city',
                    'state',
                    'pincode',
                    'latitude',
                    'longitude',
                    'created_at',
                    'updated_at',
                ]
            ]);

        // Verify cafe was created in database
        $this->assertDatabaseHas('cafes', [
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Coffee Paradise',
            'city' => 'New York',
        ]);
    }

    /**
     * Test cafe registration with minimal data
     */
    public function test_cafe_registration_with_minimal_data()
    {
        $cafeData = [
            'cafe_name' => 'Simple Cafe',
            'latitude' => 28.6139,
            'longitude' => 77.2090,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Cafe registered successfully',
            ]);

        $this->assertDatabaseHas('cafes', [
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Simple Cafe',
        ]);
    }

    /**
     * Test cafe registration without cafe_name (required field)
     */
    public function test_cafe_registration_without_name()
    {
        $cafeData = [
            'cafe_description' => 'No name cafe',
            'city' => 'Delhi',
            'latitude' => 28.6139,
            'longitude' => 77.2090,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => [
                    'cafe_name',
                ]
            ]);
    }

    /**
     * Test cafe registration without latitude/longitude (required fields)
     */
    public function test_cafe_registration_without_coordinates()
    {
        $cafeData = [
            'cafe_name' => 'Test Cafe',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'errors' => [
                    'latitude',
                    'longitude',
                ]
            ]);
    }

    /**
     * Test cafe registration with invalid pincode
     */
    public function test_cafe_registration_with_invalid_pincode()
    {
        $cafeData = [
            'cafe_name' => 'Test Cafe',
            'pincode' => '12345', // Should be 6 digits
            'latitude' => 28.6139,
            'longitude' => 77.2090,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ])
            ->assertJsonStructure([
                'errors' => [
                    'pincode',
                ]
            ]);
    }

    /**
     * Test cafe registration with invalid latitude/longitude
     */
    public function test_cafe_registration_with_invalid_coordinates()
    {
        $cafeData = [
            'cafe_name' => 'Test Cafe',
            'latitude' => 100, // Should be between -90 and 90
            'longitude' => 200, // Should be between -180 and 180
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/vendor/cafe/register', $cafeData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation Error',
            ]);
    }

    /**
     * Test get all cafes for vendor
     */
    public function test_get_vendor_cafes()
    {
        // Create multiple cafes
        Cafe::create([
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Cafe 1',
        ]);
        Cafe::create([
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Cafe 2',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/vendor/cafes');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'cafes' => [
                    '*' => [
                        'id',
                        'vendor_id',
                        'cafe_name',
                    ]
                ]
            ]);

        $this->assertCount(2, $response->json('cafes'));
    }

    /**
     * Test get single cafe
     */
    public function test_get_single_cafe()
    {
        $cafe = Cafe::create([
            'vendor_id' => $this->vendor->id,
            'cafe_name' => 'Single Cafe',
            'address' => '456 Second Ave',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/vendor/cafe/' . $cafe->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'cafe' => [
                    'id' => $cafe->id,
                    'cafe_name' => 'Single Cafe',
                ]
            ]);
    }
}
