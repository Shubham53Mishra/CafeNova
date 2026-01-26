<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Models\CafeImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CafeController extends Controller
{
    /**
     * Register a new cafe for vendor (WITHOUT images)
     */
    public function registerCafe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cafe_name' => 'required|string|max:255',
            'cafe_description' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'pincode' => 'required|digits:6',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cafe = Cafe::create([
                'vendor_id' => $request->user()->id,
                'cafe_name' => $request->cafe_name,
                'cafe_description' => $request->cafe_description,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cafe registered successfully',
                'cafe' => $cafe
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all cafes for logged-in vendor
     */
    public function getCafes(Request $request)
    {
        try {
            $cafes = Cafe::where('vendor_id', $request->user()->id)
                ->with('items.subitems', 'images')
                ->get();

            return response()->json([
                'success' => true,
                'cafes' => $cafes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single cafe with items and subitems
     */
    public function getCafe(Request $request, $cafeId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->with('items.subitems', 'images')
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'cafe' => $cafe
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }
    }

    /**
     * Update cafe
     */
    public function updateCafe(Request $request, $cafeId)
    {
        $validator = Validator::make($request->all(), [
            'cafe_name' => 'nullable|string|max:255',
            'cafe_description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|digits:6',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $cafe->update($request->only([
                'cafe_name',
                'cafe_description',
                'address',
                'city',
                'state',
                'pincode',
                'latitude',
                'longitude'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Cafe updated successfully',
                'cafe' => $cafe
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }
    }

    /**
     * Delete cafe
     */
    public function deleteCafe(Request $request, $cafeId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $cafe->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cafe deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }
    }

    /**
     * Upload images to existing cafe
     */
    public function uploadCafeImages(Request $request, $cafeId)
    {
        // Handle both single file and multiple files
        $images = $request->file('images');
        
        if (!$images) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => ['images' => ['The images field is required']]
            ], 422);
        }

        // Convert single file to array for uniform handling
        if (!is_array($images)) {
            $images = [$images];
        }

        if (empty($images)) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => ['images' => ['At least one image is required']]
            ], 422);
        }

        // Validate each image
        foreach ($images as $image) {
            if (!$image->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => ['images' => ['One or more files are invalid']]
                ], 422);
            }

            $mimes = ['jpeg', 'png', 'jpg', 'gif'];
            if (!in_array(strtolower($image->getClientOriginalExtension()), $mimes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => ['images' => ['Only JPEG, PNG, JPG, and GIF files are allowed']]
                ], 422);
            }

            if ($image->getSize() > 2048 * 1024) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => ['images' => ['Each image must be less than 2MB']]
                ], 422);
            }
        }

        try {
            // Check if cafe exists
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $uploadedCount = 0;
            $uploadedImages = [];
            $imageIndex = 0;

            foreach ($images as $image) {
                try {
                    // Store image in public/cafe_images directory
                    $imagePath = $image->store('cafe_images', 'public');
                    
                    if (!$imagePath) {
                        throw new \Exception('Failed to store image: ' . $image->getClientOriginalName());
                    }
                    
                    $imageUrl = url('storage/' . $imagePath);
                    
                    // First image is primary, rest are secondary
                    $isPrimary = ($imageIndex === 0) ? true : false;
                    
                    $cafeImage = CafeImage::create([
                        'cafe_id' => $cafe->id,
                        'image_path' => $imagePath,
                        'image_url' => $imageUrl,
                        'is_primary' => $isPrimary,
                    ]);
                    
                    $uploadedImages[] = $cafeImage;
                    $imageIndex++;
                    $uploadedCount++;
                    
                } catch (\Exception $imageError) {
                    Log::error('Image upload error: ' . $imageError->getMessage());
                    continue; // Skip this image and continue with next
                }
            }

            if ($uploadedCount === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload any images. Check server logs.',
                    'error' => 'No images were successfully uploaded'
                ], 500);
            }

            $cafe->load('images');

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully (' . $uploadedCount . ' files)',
                'cafe' => $cafe,
                'uploaded_count' => $uploadedCount
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found',
                'error' => 'Cafe with ID ' . $cafeId . ' does not exist'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Upload cafe images error: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            
            return response()->json([
                'success' => false,
                'message' => 'Error uploading images',
                'error' => app('env') === 'local' ? $e->getMessage() : 'Internal server error',
                'debug_file' => app('env') === 'local' ? $e->getFile() . ':' . $e->getLine() : null
            ], 500);
        }
    }

    /**
     * Delete cafe image
     */
    public function deleteCafeImage(Request $request, $cafeId, $imageId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $image = CafeImage::where('cafe_id', $cafe->id)
                ->where('id', $imageId)
                ->firstOrFail();

            // Delete file from storage
            Storage::disk('public')->delete($image->image_path);

            // Delete from database
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
