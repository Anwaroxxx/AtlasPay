<?php

namespace App\Http\Controllers;

use App\Services\AnwarLogic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnwarTwinController extends Controller
{
    public function index(Request $request)
    {
        $analysis = AnwarLogic::analyze($request->user());

        return Inertia::render('ai/index', [
            'analysis' => $analysis,
        ]);
    }

    public function simulate(Request $request)
    {
        $request->validate(['scenario' => 'required|string']);

        $result = AnwarLogic::simulate($request->user(), $request->scenario);

        return response()->json($result);
    }
}
