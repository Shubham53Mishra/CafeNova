<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorSignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'shop_name' => 'required|string|max:255|unique:vendors,shop_name',
            'owner_name' => 'required|string|max:255', // Full Name
            'email' => 'required|email|unique:vendors,email', // Email Address
            'mobile' => 'required|digits:10|unique:vendors,mobile', // Phone Number
            'password' => 'required|string|min:8|confirmed', // Password with Confirm Password
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|digits:6',
            'shop_type' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'owner_name.required' => 'Full Name is required',
            'email.required' => 'Email Address is required',
            'mobile.required' => 'Phone Number is required',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Password and Confirm Password must match',
            'mobile.digits' => 'Phone Number must be 10 digits',
        ];
    }
}
