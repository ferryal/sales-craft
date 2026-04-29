<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Inertia\Inertia;
use Inertia\Response;

class PreviewController extends Controller
{
    public function show(SalesPage $page): Response
    {
        // Public — no auth check. Only show completed pages.
        return Inertia::render('Preview', [
            'page' => $page->status === 'completed' ? $page : null,
        ]);
    }
}
