<?php

namespace App\Services;

class PromptBuilder
{
    private const TONE_INSTRUCTIONS = [
        'professional' => 'Formal, authoritative language. Lead with data, ROI, and business outcomes. Avoid slang. Headlines must be declarative and specific.',
        'casual'       => 'Conversational, friendly — like talking to a trusted friend. Use contractions. Keep sentences short. Headlines must feel warm and human.',
        'aggressive'   => 'Urgent, high-pressure. FOMO-driven. Use strong imperatives ("Get it now", "Stop losing money"). Headlines must create tension and urgency.',
        'luxury'       => 'Aspirational, exclusive, sophisticated. Evoke prestige. Never use words like "cheap", "deal", "affordable". Headlines must feel elite.',
    ];

    public function systemPrompt(): string
    {
        return <<<'PROMPT'
You are a world-class direct response copywriter behind 8-figure sales pages.
Your copy is specific, benefit-driven, and built to convert.

STRICT RULES — follow all of them:
1. Output ONLY a single valid JSON object. No markdown fences, no extra text, no explanation.
2. Every string must be punchy and specific — zero filler words like "amazing", "great", "innovative".
3. Benefits: each must start with a strong action verb (Eliminate / Boost / Cut / Close / Automate / Save).
4. Features: each description must answer "so what?" — explain the direct impact on the user.
5. Testimonials: must include a concrete result with a number (e.g. "Saved 6 hours/week", "Closed 3 deals in one day").
6. Headline: create curiosity or promise a specific outcome. Max 12 words. No questions.
7. Sub-headline: clarify who it's for and what they gain. Max 20 words.
8. CTA button text: action-oriented verb + outcome. Max 5 words. NOT "Get Started" or "Learn More".
PROMPT;
    }

    public function userPrompt(array $input): string
    {
        $features  = implode(', ', (array) ($input['features'] ?? []));
        $price     = !empty($input['price']) ? "\${$input['price']}" : 'Contact for pricing';
        $tone      = $input['tone'] ?? 'professional';
        $toneGuide = self::TONE_INSTRUCTIONS[$tone] ?? self::TONE_INSTRUCTIONS['professional'];
        $usps      = !empty($input['usps']) ? "Unique selling points: {$input['usps']}" : '';

        return <<<PROMPT
Generate a high-converting sales page for this product.

PRODUCT:
Name: {$input['name']}
Description: {$input['description']}
Key features: {$features}
Target audience: {$input['audience']}
Price: {$price}
{$usps}

TONE: {$tone}
Tone rules: {$toneGuide}

Return ONLY this exact JSON structure — no extra keys, no markdown, no other text:
{
  "headline": "<specific outcome-focused headline, max 12 words>",
  "sub_headline": "<who it is for + core benefit, max 20 words>",
  "description": "<powerful one-sentence benefits section heading, max 15 words>",
  "benefits": [
    "<Verb-led benefit — specific and measurable>",
    "<Verb-led benefit — specific and measurable>",
    "<Verb-led benefit — specific and measurable>",
    "<Verb-led benefit — specific and measurable>"
  ],
  "features": [
    {"title": "<feature name>", "description": "<what it does + why it matters to the user>"},
    {"title": "<feature name>", "description": "<what it does + why it matters to the user>"},
    {"title": "<feature name>", "description": "<what it does + why it matters to the user>"}
  ],
  "testimonials": [
    {"name": "<Full Name>", "role": "<Job Title, Company>", "quote": "<result-driven quote with a specific number or outcome>"},
    {"name": "<Full Name>", "role": "<Job Title, Company>", "quote": "<result-driven quote with a specific number or outcome>"}
  ],
  "pricing": {
    "price": "{$price}",
    "billing": "<short billing cycle description>",
    "cta_text": "<action verb + outcome, max 5 words>",
    "urgency": "<one short urgency line>"
  },
  "cta": {
    "button_text": "<strong CTA, max 5 words, not 'Get Started'>",
    "supporting_text": "<closing headline reinforcing the transformation, max 15 words>"
  }
}
PROMPT;
    }
}
