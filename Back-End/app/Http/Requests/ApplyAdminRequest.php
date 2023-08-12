<?php

namespace App\Http\Requests;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApplyAdminRequest extends FormRequest
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
            'document' => [
                "nullable",
                'file',
                'mimes:pdf,doc,docx,jpg,png',
                'max:2048',
            ],
            'nid_card_number' => [
                'required',
                'string',
                'max:20',
            ],
            'mobile' => 'required|string|max:15',
            'country' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ];

        return $rules;
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
