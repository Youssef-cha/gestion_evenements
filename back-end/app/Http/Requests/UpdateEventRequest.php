<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->method() == 'PATCH') {
            return [
                "title" => "sometimes|required|string|max:255",
                "description" => "sometimes|required|string|max:255",
                "start_time" => "sometimes|required|date",
                "end_time" => "sometimes|required|date",
                "location" => "sometimes|required|string|max:255",
            ];
        }
        return [
            "title" => "required|string|max:255",
            "description" => "required|string|max:255",
            "start_time" => "required|date",
            "end_time" => "required|date",
            "location" => "required|string|max:255",
        ];
    }
}
