<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class EditUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
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
            'nid_card_number' => [
                'bail',
                'requiredIf:is_a_doctor,true',
                'string',
                'max:20',
            ],
            'mobile' => 'bail|requiredIf:is_a_doctor,true|string|max:15',
            'country' => 'bail|requiredIf:is_a_doctor,true|string|max:255',
            'district' => 'bail|requiredIf:is_a_doctor,true|string|max:255',
            'address' => 'bail|requiredIf:is_a_doctor,true|string|max:255',
        ];


        // Log::alert(["new_password" => $this->input("new_password"), "confirm_password" => $this->input("confirm_password")]);
        // Add custom validation for the password change fields
        if ($this->filled('new_password') || $this->filled('old_password')) {
            $rules = array_merge($rules, [
                'old_password' => 'required_with:new_password|check_old_password',
                'new_password' => ['required_with:old_password', 'same:confirm_password', Password::min(8)],
            ]);
        }

        if ($this->input('is_a_doctor')) {
            $rules = array_merge($rules, [
                'document' => [
                    'file',
                    'mimes:pdf,doc,docx',
                    'max:2048',
                    function ($attribute, $value, $fail) {
                        if ($this->input('is_a_doctor') && !$value) {
                            $fail('The document field is required when is_a_doctor is true.');
                        }
                    },
                ],
            ]);
        }

        return $rules;
    }

    protected function isValidOldPassword(): bool
    {
        $user = $this->user(); // Assuming you have a method to get the authenticated user
        $oldPassword = $this->input('old_password');

        return Hash::check($oldPassword, $user->password);
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('old_password') != '') {
                if ($this->has('old_password') && !$this->isValidOldPassword()) {
                    $validator->errors()->add('old_password', 'Invalid old password');
                }
            }
        });
    }

    public function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors(),
        ], 400));
    }
}
