<?php

namespace App\Services;

use App\Exceptions\GenerationException;
use App\Models\SalesPage;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class SalesPageGeneratorService
{
    public function __construct(private PromptBuilder $prompt) {}

    public function generate(User $user, array $input): SalesPage
    {
        // DB-level guard: abort if a generation is already in progress
        $inProgress = SalesPage::where('user_id', $user->id)
                               ->where('status', 'processing')
                               ->exists();

        if ($inProgress) {
            throw new GenerationException('A generation is already in progress. Please wait.');
        }

        // Create record as "processing" before the AI call
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
                'error'   => $e->getMessage(),
            ]);
            throw new GenerationException('AI generation failed. Please try again.');
        }
    }

    private function callAI(array $input): array
    {
        $retries    = 0;
        $maxRetries = 1;

        while ($retries <= $maxRetries) {
            try {
                $response = OpenAI::chat()->create([
                    'model'           => 'gpt-4o-mini',
                    'messages'        => [
                        ['role' => 'system', 'content' => $this->prompt->systemPrompt()],
                        ['role' => 'user',   'content' => $this->prompt->userPrompt($input)],
                    ],
                    'temperature'     => 0.7,
                    'max_tokens'      => 2000,
                    'response_format' => ['type' => 'json_object'],
                ]);

                $content = $response->choices[0]->message->content;
                $decoded = json_decode($content, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new \RuntimeException('Invalid JSON response from AI');
                }

                return $decoded;

            } catch (\RuntimeException $e) {
                // Malformed JSON — retry once
                $retries++;
                if ($retries > $maxRetries) {
                    throw new GenerationException('AI returned an invalid response. Please try again.');
                }

            } catch (\Exception $e) {
                if (str_contains($e->getMessage(), '429')) {
                    throw new GenerationException('AI service is busy. Please try again in a few minutes.');
                }
                if (str_contains($e->getMessage(), 'timeout') || str_contains($e->getMessage(), 'timed out')) {
                    throw new GenerationException('AI service timed out. Please try again.');
                }
                throw $e;
            }
        }

        throw new GenerationException('Generation failed after retries.');
    }
}
