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

    public function chat(array $messages, string $systemPrompt = ''): string
    {
        if (empty($this->apiKey)) {
            return "GROQ_API_KEY is not configured.";
        }

        $allMessages = [];
        if ($systemPrompt) {
            $allMessages[] = ['role' => 'system', 'content' => $systemPrompt];
        }
        $allMessages = array_merge($allMessages, $messages);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->withoutVerifying()
            ->post($this->baseUrl, [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => $allMessages,
                'temperature' => 0.7,
            ]);

            return $response->successful() ? $response->json('choices.0.message.content') : "Error: " . $response->body();
        } catch (\Exception $e) {
            return "Exception: " . $e->getMessage();
        }
    }

    public function analyzeSpending(array $transactions, array $budgets): array
    {
        if (empty($this->apiKey)) {
            return [
                'summary' => 'API Key missing.',
                'critical_insight' => 'Please configure Groq.',
                'recommendations' => []
            ];
        }

        $data = "Categories: " . json_encode($transactions) . " | Budgets: " . json_encode($budgets);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->withoutVerifying()
            ->post($this->baseUrl, [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are SmartBanking AI. Analyze the data and return ONLY a JSON object.
                        Format:
                        {
                          "summary": "1-2 sharp sentences about the month",
                          "critical_insight": "One major warning or highlight",
                          "recommendations": ["tip 1", "tip 2"]
                        }'
                    ],
                    [
                        'role' => 'user',
                        'content' => $data
                    ]
                ],
                'temperature' => 0.6,
            ]);

            if ($response->successful()) {
                $clean = trim(str_replace(['```json', '```'], '', $response->json('choices.0.message.content')));
                return json_decode($clean, true) ?: [
                    'summary' => $response->json('choices.0.message.content'),
                    'critical_insight' => 'Analysis complete.',
                    'recommendations' => ['Review your spending manually.']
                ];
            }

            return [
                'summary' => 'Analysis unavailable.',
                'critical_insight' => 'Network error.',
                'recommendations' => []
            ];

        } catch (\Exception $e) {
            return [
                'summary' => 'Analysis exception.',
                'critical_insight' => $e->getMessage(),
                'recommendations' => []
            ];
        }
    }
}
