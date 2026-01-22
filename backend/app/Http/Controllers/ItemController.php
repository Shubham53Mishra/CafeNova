<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{
    /**
     * Add item to cafe
     */
    public function addItem(Request $request, $cafeId)
    {
        $validator = Validator::make($request->all(), [
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
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

            $item = Item::create([
                'cafe_id' => $cafe->id,
                'item_name' => $request->item_name,
                'description' => $request->description,
                'price' => $request->price,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Item added successfully',
                'item' => $item
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }
    }

    /**
     * Get all items in cafe
     */
    public function getItems(Request $request, $cafeId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $items = Item::where('cafe_id', $cafe->id)
                ->with('subitems')
                ->get();

            return response()->json([
                'success' => true,
                'items' => $items
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found'
            ], 404);
        }
    }

    /**
     * Get single item
     */
    public function getItem(Request $request, $cafeId, $itemId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->with('subitems')
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'item' => $item
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Update item
     */
    public function updateItem(Request $request, $cafeId, $itemId)
    {
        $validator = Validator::make($request->all(), [
            'item_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_available' => 'nullable|boolean',
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

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->firstOrFail();

            $item->update($request->only([
                'item_name',
                'description',
                'price',
                'is_available'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Item updated successfully',
                'item' => $item
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Delete item
     */
    public function deleteItem(Request $request, $cafeId, $itemId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->firstOrFail();

            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found'
            ], 404);
        }
    }
}
