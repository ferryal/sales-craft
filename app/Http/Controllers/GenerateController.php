<?php

namespace App\Http\Controllers;

use App\Exceptions\GenerationException;
use App\Http\Requests\GenerateSalesPageRequest;
use App\Services\SalesPageGeneratorService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class GenerateController extends Controller
{
    public function __construct(private SalesPageGeneratorService $generator) {}

    public function create(): Response
    {
        return Inertia::render('Generate');
    }

    public function store(GenerateSalesPageRequest $request): \Illuminate\Http\RedirectResponse|Response
    {
        $user    = $request->user();
        $lockKey = "generate_lock:user:{$user->id}";
        $lock    = Cache::lock($lockKey, seconds: 60);

        if (! $lock->get()) {
            return back()->withErrors([
                'concurrent' => 'A generation is already in progress. Please wait.',
            ]);
        }

        try {
            $page = $this->generator->generate($user, $request->validated());

            return redirect()->route('pages.show', $page->id);

        } catch (GenerationException $e) {
            return back()->withErrors(['generation' => $e->getMessage()]);

        } finally {
            $lock->release();
        }
    }
}
