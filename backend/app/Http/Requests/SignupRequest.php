<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|unique:users|regex:/^[0-9]{10}$/',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ];
    }

    public function messages()
    {
        return [
            'mobile.regex' => 'Mobile number must be 10 digits',
            'mobile.unique' => 'Mobile number already exists',
            'email.unique' => 'Email already registered',
            'password.confirmed' => 'Password confirmation does not match',
        ];
    }
}
