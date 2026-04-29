<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesPageController extends Controller
{
    public function index(Request $request): Response
    {
        $pages = SalesPage::where('user_id', $request->user()->id)
            ->latest()
            ->get(['id', 'title', 'tone', 'status', 'created_at']);

        return Inertia::render('SalesPages/Index', ['pages' => $pages]);
    }

    public function show(Request $request, SalesPage $page): Response
    {
        $this->authorize($request->user(), $page);

        return Inertia::render('SalesPages/Show', ['page' => $page]);
    }

    public function edit(Request $request, SalesPage $page): Response
    {
        $this->authorize($request->user(), $page);

        return Inertia::render('Generate', [
            'prefill' => $page->input_data,
        ]);
    }

    public function destroy(Request $request, SalesPage $page): \Illuminate\Http\RedirectResponse
    {
        $this->authorize($request->user(), $page);
        $page->delete();

        return back();
    }

    public function export(Request $request, SalesPage $page): \Illuminate\Http\Response
    {
        $this->authorize($request->user(), $page);

        if (! $page->isCompleted()) {
            abort(404);
        }

        $html = view('exports.sales-page', ['page' => $page])->render();
        $filename = str($page->title)->slug()->append('.html');

        return response($html, 200, [
            'Content-Type'        => 'text/html',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function authorize($user, SalesPage $page): void
    {
        abort_if($page->user_id !== $user->id, 403);
    }
}
