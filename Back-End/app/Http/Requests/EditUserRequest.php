<?php

namespace App\Http\Requests;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Http\Exceptions\HttpResponseException;

class EditUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        try {
            JWTAuth::parseToken()->authenticate();
            return true;
        } catch (JWTException $e) {
            return response()->json(["error" => "authentication failed"], 400);
            return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'date_of_birth' => 'required|date',
        ];

        // Check if is_a_doctor is true, then add additional required fields
        if ($this->input('is_a_doctor')) {
            $rules = array_merge($rules, [
                'document' => 'required|file|mimes:pdf,doc,docx|max:2048',
                'nid_card_number' => 'required|string|max:20|unique:users,nid_card_number',
                'mobile' => 'required|string|max:15',
                'country' => 'required|string|max:255',
                'district' => 'required|string|max:255',
                'address' => 'required|string|max:255',
            ]);
        }

        // Add custom validation for the password change fields
        if ($this->filled('new_password') || $this->filled('old_password')) {
            $rules = array_merge($rules, [
                'old_password' => 'required_with:new_password|password',
                'new_password' => ['required_with:old_password', 'confirmed', Password::min(8)],
            ]);
        }

        return $rules;
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors(),
        ], 400));
    }
}
