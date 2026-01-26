<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CafeController extends Controller
{
    /**
     * Register a new cafe for vendor
     */
    public function registerCafe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cafe_name' => 'required|string|max:255',
            'cafe_description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|digits:6',
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
                ->with('items.subitems')
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
                ->with('items.subitems')
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
}
