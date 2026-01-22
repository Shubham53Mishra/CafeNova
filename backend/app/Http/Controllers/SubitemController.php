<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Models\Item;
use App\Models\Subitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubitemController extends Controller
{
    /**
     * Add subitem to item
     */
    public function addSubitem(Request $request, $cafeId, $itemId)
    {
        $validator = Validator::make($request->all(), [
            'subitem_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'additional_price' => 'nullable|numeric|min:0',
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

            $subitem = Subitem::create([
                'item_id' => $item->id,
                'subitem_name' => $request->subitem_name,
                'description' => $request->description,
                'additional_price' => $request->additional_price,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subitem added successfully',
                'subitem' => $subitem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Get all subitems for item
     */
    public function getSubitems(Request $request, $cafeId, $itemId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->firstOrFail();

            $subitems = Subitem::where('item_id', $item->id)->get();

            return response()->json([
                'success' => true,
                'subitems' => $subitems
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Get single subitem
     */
    public function getSubitem(Request $request, $cafeId, $itemId, $subitemId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->firstOrFail();

            $subitem = Subitem::where('item_id', $item->id)
                ->where('id', $subitemId)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'subitem' => $subitem
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subitem not found'
            ], 404);
        }
    }

    /**
     * Update subitem
     */
    public function updateSubitem(Request $request, $cafeId, $itemId, $subitemId)
    {
        $validator = Validator::make($request->all(), [
            'subitem_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'additional_price' => 'nullable|numeric|min:0',
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

            $subitem = Subitem::where('item_id', $item->id)
                ->where('id', $subitemId)
                ->firstOrFail();

            $subitem->update($request->only([
                'subitem_name',
                'description',
                'additional_price',
                'is_available'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Subitem updated successfully',
                'subitem' => $subitem
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subitem not found'
            ], 404);
        }
    }

    /**
     * Delete subitem
     */
    public function deleteSubitem(Request $request, $cafeId, $itemId, $subitemId)
    {
        try {
            $cafe = Cafe::where('vendor_id', $request->user()->id)
                ->where('id', $cafeId)
                ->firstOrFail();

            $item = Item::where('cafe_id', $cafe->id)
                ->where('id', $itemId)
                ->firstOrFail();

            $subitem = Subitem::where('item_id', $item->id)
                ->where('id', $subitemId)
                ->firstOrFail();

            $subitem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Subitem deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subitem not found'
            ], 404);
        }
    }
}
