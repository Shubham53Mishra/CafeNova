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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:vendors,email', // Email Address
            'phone' => 'required|digits:10|unique:vendors,mobile', // Phone Number
            'password' => 'required|string|min:8|confirmed:confirmPassword', // Password with Confirm Password
            'confirmPassword' => 'required|string|min:8',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email Address is required',
            'phone.required' => 'Phone Number is required',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Password and Confirm Password must match',
            'phone.digits' => 'Phone Number must be 10 digits',
        ];
    }
}
