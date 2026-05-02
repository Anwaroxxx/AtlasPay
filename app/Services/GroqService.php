<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
    }

    public function analyzeSpending(array $transactions, array $budgets): string
    {
        if (empty($this->apiKey)) {
            return "GROQ_API_KEY is not configured. Please add it to your .env file.";
        }

        $prompt = $this->buildPrompt($transactions, $budgets);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl, [
                'model' => 'mixtral-8x7b-32768', // Or another Groq model
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a professional financial advisor AI. Analyze the user\'s spending patterns and provide actionable insights, warnings, and suggestions. Keep your response concise, professional, and formatted in markdown.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }

            Log::error('Groq API Error: ' . $response->body());
            return "Sorry, I couldn't analyze your spending at this moment.";

        } catch (\Exception $e) {
            Log::error('Groq Exception: ' . $e->getMessage());
            return "An error occurred while connecting to the AI service.";
        }
    }

    protected function buildPrompt(array $transactions, array $budgets): string
    {
        $prompt = "Here is the user's financial data for the current month:\n\n";
        
        $prompt .= "### Transactions by Category:\n";
        foreach ($transactions as $cat => $amount) {
            $prompt .= "- $cat: $amount MAD\n";
        }

        if (!empty($budgets)) {
            $prompt .= "\n### Budgets vs Actual Spending:\n";
            foreach ($budgets as $cat => $budget) {
                $actual = $transactions[$cat] ?? 0;
                $prompt .= "- $cat: Budget: $budget MAD, Actual: $actual MAD\n";
            }
        }

        $prompt .= "\nPlease provide:\n1. A summary of the spending patterns.\n2. Identification of any overspending or near-limit categories.\n3. Three specific, actionable tips to improve their financial health.";

        return $prompt;
    }
}
