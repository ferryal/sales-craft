<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateSalesPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'features'    => ['required'],          // accepts array or comma string
            'audience'    => ['required', 'string', 'max:500'],
            'usps'        => ['nullable', 'string', 'max:1000'],
            'tone'        => ['required', 'in:professional,casual,aggressive,luxury'],
            'price'       => ['nullable', 'string', 'max:100'],
            'model'       => ['nullable', 'string', 'in:llama-3.1-8b-instant,gemini-2.0-flash,claude-haiku-4-5-20251001,gpt-4o-mini'],
        ];
    }

    public function prepareForValidation(): void
    {
        // Normalize features: accept either array or comma-separated string
        if (is_string($this->features)) {
            $this->merge([
                'features' => array_filter(array_map('trim', explode(',', $this->features))),
            ]);
        }
    }
}
