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
            'email' => 'required|email|unique:vendors,email',
            'phone' => 'required|digits:10|unique:vendors,mobile',
            'password' => 'required|string|min:8',
            'confirmPassword' => 'required|string|min:8',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get password and confirmPassword from request
            $password = $this->input('password');
            $confirmPassword = $this->input('confirmPassword');
            
            // Check if passwords match
            if ($password && $confirmPassword && $password !== $confirmPassword) {
                $validator->errors()->add('password', 'Password and Confirm Password must match');
            }
        });
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
            'phone.digits' => 'Phone Number must be 10 digits',
        ];
    }
}
