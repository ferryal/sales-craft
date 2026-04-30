<?php

namespace App\Http\Controllers;

use App\Exceptions\GenerationException;
use App\Models\SalesPage;
use App\Services\SalesPageGeneratorService;
use Illuminate\Http\Request;

class RegenerateSectionController extends Controller
{
    private const ALLOWED_SECTIONS = ['hero', 'benefits', 'features', 'testimonials', 'pricing', 'cta'];

    public function __construct(private SalesPageGeneratorService $generator) {}

    public function __invoke(Request $request, SalesPage $page): \Illuminate\Http\RedirectResponse
    {
        abort_if($page->user_id !== $request->user()->id, 403);
        abort_if(! $page->isCompleted(), 404);

        $request->validate([
            'section' => ['required', 'in:' . implode(',', self::ALLOWED_SECTIONS)],
        ]);

        try {
            $this->generator->regenerateSection($page, $request->section);
        } catch (GenerationException $e) {
            return back()->withErrors(['regeneration' => $e->getMessage()]);
        }

        return redirect()->route('pages.show', $page->id);
    }
}
