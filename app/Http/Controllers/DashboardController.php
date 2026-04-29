<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $recentPages = SalesPage::where('user_id', $user->id)
            ->where('status', 'completed')
            ->latest()
            ->limit(6)
            ->get(['id', 'title', 'tone', 'status', 'created_at']);

        $stats = [
            'total'      => SalesPage::where('user_id', $user->id)->where('status', 'completed')->count(),
            'this_month' => SalesPage::where('user_id', $user->id)
                                     ->where('status', 'completed')
                                     ->whereMonth('created_at', now()->month)
                                     ->count(),
            'this_week'  => SalesPage::where('user_id', $user->id)
                                     ->where('status', 'completed')
                                     ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                                     ->count(),
        ];

        return Inertia::render('dashboard', [
            'recentPages' => $recentPages,
            'stats'       => $stats,
        ]);
    }
}
