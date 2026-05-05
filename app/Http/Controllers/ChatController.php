<?php

namespace App\Http\Controllers;

use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function ask(Request $request, GroqService $groqService)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $apiKey = config('services.groq.key');
        if (!$apiKey) {
            return response()->json(['error' => 'AI Service is not configured.'], 500);
        }

        $user = $request->user();
        
        try {
            $accounts = $user->accounts()->get();
            $totalBalance = $accounts->sum('balance');
            $activeCredit = $user->credits()->where('status', 'active')->first();
            $budgets = $user->budgets()->where('month', now()->month)->get();
            $creditScore = $user->credit_score;

            $context = "You are a helpful and friendly Bank Assistant for AtlasPay. You are helping {$user->name}. 
            User Status:
            - Credit Score: {$creditScore}
            - Balance: {$totalBalance} MAD
            - Active Credit: " . ($activeCredit ? "Yes, {$activeCredit->amount} MAD due on " . ($activeCredit->due_date ? $activeCredit->due_date->format('Y-m-d') : 'N/A') : "No") . "
            - Monthly Budgets: " . $budgets->count() . "
            
            Rules:
            - Be natural, friendly, and use normal grammar.
            - Help users with their questions about their account and credits.
            - Use MAD for currency.";

            $answer = $groqService->chat([
                ['role' => 'user', 'content' => $request->message]
            ], $context);

            return response()->json([
                'answer' => $answer
            ]);

        } catch (\Exception $e) {
            Log::error('Chat AI Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong on our end.'], 500);
        }
    }
}
