<?php

namespace App\Services;

class PromptBuilder
{
    public function systemPrompt(): string
    {
        return <<<'PROMPT'
You are a world-class direct response copywriter specializing in high-converting sales pages.
Generate a complete sales page in valid JSON format only.
Do not include any text, markdown, or explanation outside the JSON object.
The JSON must be parseable by json_decode().
PROMPT;
    }

    public function userPrompt(array $input): string
    {
        $features = implode(', ', (array) ($input['features'] ?? []));

        return <<<PROMPT
Generate a compelling sales page for the following product:

Product Name: {$input['name']}
Description: {$input['description']}
Key Features: {$features}
Target Audience: {$input['audience']}
Price: {$input['price']}
Unique Selling Points: {$input['usps']}
Tone: {$input['tone']}

Return ONLY a JSON object with exactly these keys:
{
  "headline": "compelling main headline (max 12 words)",
  "sub_headline": "supporting statement (max 20 words)",
  "description": "product description for benefits section heading (max 15 words)",
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "features": [
    {"title": "Feature Name", "description": "One sentence description"}
  ],
  "testimonials": [
    {"name": "Full Name", "role": "Job Title, Company", "quote": "Realistic testimonial quote"}
  ],
  "pricing": {
    "price": "\${$input['price']}",
    "billing": "billing description",
    "cta_text": "CTA button text",
    "urgency": "urgency line"
  },
  "cta": {
    "button_text": "Primary CTA text",
    "supporting_text": "Footer headline reinforcing the main value prop"
  }
}
PROMPT;
    }
}
