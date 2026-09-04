<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $now = Carbon::now();

        Budget::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'category' => $request->category,
                'month' => $now->month,
                'year' => $now->year,
            ],
            [
                'amount' => $request->amount,
            ]
        );

        return back()->with('success', 'Budget updated successfully.');
    }
}
