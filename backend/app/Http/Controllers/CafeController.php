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
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if cafe exists
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $uploadedCount = 0;
            $uploadedImages = [];

            if ($request->hasFile('images')) {
                $images = $request->file('images');
                
                foreach ($images as $image) {
                    try {
                        // Store image in public/cafe_images directory
                        $imagePath = $image->store('cafe_images', 'public');
                        
                        if (!$imagePath) {
                            throw new \Exception('Failed to store image: ' . $image->getClientOriginalName());
                        }
                        
                        $imageUrl = url('storage/' . $imagePath);
                        
                        $cafeImage = CafeImage::create([
                            'cafe_id' => $cafe->id,
                            'image_path' => $imagePath,
                            'image_url' => $imageUrl,
                            'is_primary' => false,
                        ]);
                        
                        $uploadedImages[] = $cafeImage;
                        $uploadedCount++;
                        
                    } catch (\Exception $imageError) {
                        Log::error('Image upload error: ' . $imageError->getMessage());
                        continue; // Skip this image and continue with next
                    }
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
