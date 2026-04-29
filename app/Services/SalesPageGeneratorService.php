<?php

namespace App\Services;

use App\Exceptions\GenerationException;
use App\Models\SalesPage;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class SalesPageGeneratorService
{
    // Maps model IDs to their provider and API model string
    private const MODEL_MAP = [
        'llama-3.1-8b-instant'      => ['provider' => 'groq',      'api_model' => 'llama-3.1-8b-instant'],
        'gemini-2.0-flash'          => ['provider' => 'gemini',    'api_model' => 'gemini-2.0-flash'],
        'claude-haiku-4-5-20251001' => ['provider' => 'anthropic', 'api_model' => 'claude-haiku-4-5-20251001'],
        'gpt-4o-mini'               => ['provider' => 'openai',    'api_model' => 'gpt-4o-mini'],
    ];

    private const DEFAULT_MODEL = 'llama-3.1-8b-instant';

    public function __construct(private PromptBuilder $prompt) {}

    public function generate(User $user, array $input): SalesPage
    {
        $inProgress = SalesPage::where('user_id', $user->id)
                               ->where('status', 'processing')
                               ->exists();

        if ($inProgress) {
            throw new GenerationException('A generation is already in progress. Please wait.');
        }

        $page = SalesPage::create([
            'user_id'     => $user->id,
            'title'       => $input['name'],
            'input_data'  => $input,
            'output_data' => null,
            'tone'        => $input['tone'],
            'status'      => 'processing',
        ]);

        try {
            $output = $this->callAI($input);

            $page->update([
                'output_data' => $output,
                'status'      => 'completed',
            ]);

            return $page->fresh();

        } catch (\Throwable $e) {
            $page->update(['status' => 'failed']);
            Log::error('Sales page generation failed', [
                'user_id' => $user->id,
                'page_id' => $page->id,
                'model'   => $input['model'] ?? self::DEFAULT_MODEL,
                'error'   => $e->getMessage(),
            ]);
            throw new GenerationException($e->getMessage());
        }
    }

    // ── Router ────────────────────────────────────────────────────────────────

    private function callAI(array $input): array
    {
        $modelId  = $input['model'] ?? self::DEFAULT_MODEL;
        $modelDef = self::MODEL_MAP[$modelId] ?? self::MODEL_MAP[self::DEFAULT_MODEL];

        return match ($modelDef['provider']) {
            'gemini'    => $this->callGemini($modelDef['api_model'], $input),
            'groq'      => $this->callGroq($modelDef['api_model'], $input),
            'anthropic' => $this->callAnthropic($modelDef['api_model'], $input),
            'openai'    => $this->callOpenAI($modelDef['api_model'], $input),
            default     => throw new GenerationException("Unknown AI provider for model: {$modelId}"),
        };
    }

    // ── Google Gemini ─────────────────────────────────────────────────────────

    private function callGemini(string $model, array $input): array
    {
        $key = config('services.gemini.key');
        if (empty($key)) {
            throw new GenerationException('Gemini API key not configured. Set GEMINI_API_KEY in .env.');
        }

        $response = Http::timeout(30)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$key}", [
                'systemInstruction' => [
                    'parts' => [['text' => $this->prompt->systemPrompt()]],
                ],
                'contents' => [
                    ['parts' => [['text' => $this->prompt->userPrompt($input)]]],
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'temperature'      => 0.7,
                    'maxOutputTokens'  => 2000,
                ],
            ]);

        if ($response->status() === 429) {
            throw new GenerationException('Gemini is busy. Please try again in a moment.');
        }
        if ($response->failed()) {
            $error = $response->json('error.message') ?? "HTTP {$response->status()}";
            throw new GenerationException("Gemini error: {$error}");
        }

        $text = $response->json('candidates.0.content.parts.0.text') ?? '';
        return $this->decodeJson($text);
    }

    // ── Groq (Llama / OpenAI-compatible) ──────────────────────────────────────

    private function callGroq(string $model, array $input): array
    {
        $key = config('services.groq.key');
        if (empty($key)) {
            throw new GenerationException('Groq API key not configured. Set GROQ_API_KEY in .env.');
        }

        $response = Http::withToken($key)
            ->timeout(30)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'           => $model,
                'messages'        => [
                    ['role' => 'system', 'content' => $this->prompt->systemPrompt()],
                    ['role' => 'user',   'content' => $this->prompt->userPrompt($input)],
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature'     => 0.7,
                'max_tokens'      => 2000,
            ]);

        if ($response->status() === 429) {
            throw new GenerationException('Groq rate limit hit. Please try again in a moment.');
        }
        if ($response->failed()) {
            $error = $response->json('error.message') ?? "HTTP {$response->status()}";
            throw new GenerationException("Groq error: {$error}");
        }

        $text = $response->json('choices.0.message.content') ?? '';
        return $this->decodeJson($text);
    }

    // ── Anthropic Claude ──────────────────────────────────────────────────────

    private function callAnthropic(string $model, array $input): array
    {
        $key = config('services.anthropic.key');
        if (empty($key)) {
            throw new GenerationException('Anthropic API key not configured. Set ANTHROPIC_API_KEY in .env.');
        }

        $response = Http::withHeaders([
            'x-api-key'         => $key,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
            'model'      => $model,
            'max_tokens' => 2000,
            'system'     => $this->prompt->systemPrompt(),
            'messages'   => [
                ['role' => 'user',      'content' => $this->prompt->userPrompt($input)],
                ['role' => 'assistant', 'content' => '{'],  // prefill → forces JSON
            ],
        ]);

        if ($response->status() === 429) {
            throw new GenerationException('Claude is busy. Please try again in a moment.');
        }
        if ($response->failed()) {
            $error = $response->json('error.message') ?? "HTTP {$response->status()}";
            throw new GenerationException("Anthropic error: {$error}");
        }

        // Anthropic returns completion after prefill — prepend '{'
        $text = '{' . ($response->json('content.0.text') ?? '');
        return $this->decodeJson($text);
    }

    // ── OpenAI ────────────────────────────────────────────────────────────────

    private function callOpenAI(string $model, array $input): array
    {
        $retries    = 0;
        $maxRetries = 1;

        while ($retries <= $maxRetries) {
            try {
                $response = OpenAI::chat()->create([
                    'model'           => $model,
                    'messages'        => [
                        ['role' => 'system', 'content' => $this->prompt->systemPrompt()],
                        ['role' => 'user',   'content' => $this->prompt->userPrompt($input)],
                    ],
                    'temperature'     => 0.7,
                    'max_tokens'      => 2000,
                    'response_format' => ['type' => 'json_object'],
                ]);

                return $this->decodeJson($response->choices[0]->message->content);

            } catch (\RuntimeException $e) {
                $retries++;
                if ($retries > $maxRetries) {
                    throw new GenerationException('AI returned an invalid response. Please try again.');
                }
            } catch (\Exception $e) {
                $msg = $e->getMessage();
                if (str_contains($msg, '429') || str_contains($msg, 'rate limit')) {
                    throw new GenerationException('OpenAI is busy. Please try again in a moment.');
                }
                if (str_contains($msg, 'timeout') || str_contains($msg, 'timed out')) {
                    throw new GenerationException('OpenAI timed out. Please try again.');
                }
                throw $e;
            }
        }

        throw new GenerationException('Generation failed after retries.');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function decodeJson(string $text): array
    {
        // Strip markdown code fences if model wraps output in ```json ... ```
        $text = preg_replace('/^```(?:json)?\s*/i', '', trim($text));
        $text = preg_replace('/\s*```$/', '', $text);

        $decoded = json_decode(trim($text), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new GenerationException('AI returned malformed JSON. Please try again.');
        }
        return $decoded;
    }
}
