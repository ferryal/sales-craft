<?php

namespace App\Services;

use App\Exceptions\GenerationException;
use App\Models\SalesPage;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
class SalesPageGeneratorService
{
    private const MODEL_MAP = [
        'llama-3.1-8b-instant'     => ['provider' => 'groq',       'api_model' => 'llama-3.1-8b-instant'],
        'gemini-2.5-flash'         => ['provider' => 'gemini',     'api_model' => 'gemini-2.5-flash'],
        'openai/gpt-oss-20b:free'  => ['provider' => 'openrouter', 'api_model' => 'openai/gpt-oss-20b:free'],
        'openai/gpt-oss-120b:free' => ['provider' => 'openrouter', 'api_model' => 'openai/gpt-oss-120b:free'],
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
            'gemini'     => $this->callGemini($modelDef['api_model'], $input),
            'groq'       => $this->callOpenAICompat('https://api.groq.com/openai/v1/chat/completions', config('services.groq.key'), 'GROQ_API_KEY', $modelDef['api_model'], $input),
            'openrouter' => $this->callOpenRouter($modelDef['api_model'], $input),
            default      => throw new GenerationException("Unknown provider for model: {$modelId}"),
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

    // ── OpenRouter ────────────────────────────────────────────────────────────

    private function callOpenRouter(string $model, array $input): array
    {
        $key = config('services.openrouter.key');
        if (empty($key)) {
            throw new GenerationException('OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env.');
        }

        $response = Http::withToken($key)
            ->withHeaders([
                'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                'X-Title'      => config('app.name', 'SalesCraft AI'),
            ])
            ->timeout(30)
            ->post('https://openrouter.ai/api/v1/chat/completions', [
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
            throw new GenerationException('OpenRouter rate limit hit. Try a different model or wait a moment.');
        }
        if ($response->failed()) {
            $error = $response->json('error.message') ?? "HTTP {$response->status()}";
            throw new GenerationException("OpenRouter error ({$model}): {$error}");
        }

        $text = $response->json('choices.0.message.content') ?? '';
        return $this->decodeJson($text);
    }

    // ── OpenAI-compatible (Groq) ──────────────────────────────────────────────

    private function callOpenAICompat(string $endpoint, ?string $key, string $envVar, string $model, array $input): array
    {
        if (empty($key)) {
            throw new GenerationException("API key not configured. Set {$envVar} in .env.");
        }

        $response = Http::withToken($key)
            ->timeout(30)
            ->post($endpoint, [
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
            throw new GenerationException('Rate limit reached. Please try again in a moment.');
        }
        if ($response->failed()) {
            $error = $response->json('error.message') ?? "HTTP {$response->status()}";
            throw new GenerationException("AI error ({$model}): {$error}");
        }

        $text = $response->json('choices.0.message.content') ?? '';
        return $this->decodeJson($text);
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
