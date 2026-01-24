<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Http\Requests\VendorSignupRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class VendorAuthController extends Controller
{
    /**
     * Vendor Signup
     */
    public function signup(VendorSignupRequest $request)
    {
        try {
            $vendor = Vendor::create([
                'shop_name' => $request->shop_name,
                'owner_name' => $request->owner_name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'password' => Hash::make($request->password),
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'shop_type' => $request->shop_type,
            ]);

            $token = $vendor->createToken('vendorToken')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Vendor registered successfully',
                'vendor' => $vendor,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vendor Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = Vendor::where('email', $request->email)->first();

            if (!$vendor || !Hash::check($request->password, $vendor->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ], 401);
            }

            if (!$vendor->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vendor account is inactive'
                ], 403);
            }

            $token = $vendor->createToken('vendorToken')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'vendor' => $vendor,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Logged In Vendor Profile
     */
    public function getProfile(Request $request)
    {
        return response()->json([
            'success' => true,
            'vendor' => $request->user()
        ]);
    }

    /**
     * Update Vendor Profile
     */
    public function updateProfile(Request $request)
    {
        $vendor = $request->user();

        $validator = Validator::make($request->all(), [
            'owner_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|digits:6',
            'shop_type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor->update($request->only([
                'owner_name',
                'address',
                'city',
                'state',
                'pincode',
                'shop_type'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'vendor' => $vendor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vendor Logout
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
