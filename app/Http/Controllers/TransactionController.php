<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TransactionController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request,)
    {
        // dd($request->all());
        //

        $validated = $request->validate([
            "from_account_rib" => ["required"],
            "to_account_rib" => ["required"],
            "amount" => ["required","numeric"]
            ]);
            
            $from = Account::where("account_number",$request->from_account_rib)->first();
            $to = Account::where("account_number",$request->to_account_rib)->first();
            $amount = $request->amount;
            $method = $request->transfer;
            


        if(!$from || ! $to )
            {
                return back()->withErrors([
                    'message' => 'Invalid account'
                ],422);
            }
        if($amount > $from->balance)
            {

                return back()->withErrors ([
                    'message' =>"insufficient funds"
                ]);
            }
        if($from->status !== "active" )
            {
                return back()->withErrors ([
                    'message' =>"Sender account is not active"
                ]);
            }
        if( $to->status !== "active")
            {
                return back()->withErrors ([
                    'message' =>"Reciver account is not active"
                ]);
            }

            // Gate::authorize("transferMoney",$from);
            
            if(!auth()->user()->can("transferMoney",$from))
                {
                    return back()->withErrors ([
                    'message' =>"action not athorized"
                ]);
                }
        
        TransactionService::create([
            "from" => $from,
            "to" => $to,
            "amount" => $amount,
            "method" => $method,
        ]);
    }

    
}
