<?php

namespace App\Http\Controllers\Qr;

use App\Enums\QrTypes;
use App\Enums\RedirectGoals;
use App\Enums\TokenStatus;
use App\Http\Controllers\Controller;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TokenController extends Controller
{

    public function storeSender(Request $request)
    {
        $request->validate([
            "amount" => ["required", "numeric"]
        ]);

        return $this->store($request, QrTypes::SENDER);
    }

    public function storeReceiver(Request $request)
    {

        return $this->store($request, QrTypes::RECEIVER);
    }

    public function storeReceiverSTORE(Request $request)
    {
        return $this->store($request, QrTypes::STORE);
    }

    public function store(Request $request, QrTypes $qrType)
    {

        $walletId = auth()->user()->wallet->id;

        switch ($qrType) {

            case QrTypes::SENDER:
                $token = [
                    "from_account_id" => $walletId,
                    "to_account_id" =>  null,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::SENDER
                ];
                break;

            case QrTypes::RECEIVER:
                $token = [
                    "from_account_id" => null,
                    "to_account_id" =>  $walletId,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::RECEIVER
                ];
                break;

            case QrTypes::STORE:
                $token = [
                    "from_account_id" => null,
                    "to_account_id" =>  $walletId,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::STORE
                ];
                break;

            default:
                return back()->withErrors("qrType is not provided");
        }

        //if the qr type is store then make the expiration date a decade
        if ($request->qr === QrTypes::STORE) {
            $expireDate = now()->addDecade();
        } else {
            $expireDate = now()->addMinutes(5);
        }
                    // dd(auth()->user()->id);
        $tokenAll = [
            "token" => Str::uuid(),
            "created_by_account_id" => auth()->user()->id,
            ...$token,
            "expires_at" =>  $expireDate,
            "status" => TokenStatus::PENDING
        ];

        Token::create($tokenAll);
        $url = Crypt::encryptString($tokenAll["token"]);

        return Inertia::render("transactions/qr/shared/qr_page", ["url" => $url]);
    }





    public function updateSender(Request $request, string $id)
    {
        $token = Token::where("token", (Crypt::decryptString($id)))->first();
        $account_id = auth()->user()->wallet->id;
        $id = $token->id ;
        $token->update([
            "to_account_id" => $account_id
        ]);

        return $this->update($request, $id);
    }

    public function updateReceiver(Request $request, string $id)
    {
        
        $request->validate([
            "amount" => ["required","numeric"]
        ]);

        $account_id = auth()->user()->wallet->id;
        $token = Token::find($id);
    
        $token->update([
            "to_account_id" => $account_id,
        ]);

        return $this->update($request, $id);
    }

    public function updateReceiverSTORE(Request $request, string $id)
    {
        $request->validate([
            "amount" => ["required","numeric"]
        ]);

        $account_id = auth()->user()->wallet->id;
        $amount = $request->amount;
        $token = Token::find($id);
    
        $token->update([
            "from_account_id" => $account_id,
            "amount" => $amount,
        ]);

        return $this->update($request, $id);
    }

    public function update(Request $request, string $id )
    {

        $token = Token::find($id);

        if(!$token)
            {
                return back()->withErrors("token does not exist");
            }

        if($token->expires_at <= now())
            {
                $token->update([
                    "status" => TokenStatus::EXPIRED
                ]);
                return back()->withErrors("code no longer valid");
            }

        if(!$token->amount)
            {
                $token->update([
                    "status" => TokenStatus::CANCELLED
                ]);
                return back()->withErrors("amount not specified");
            }

        if(!$token->from_account_id || !$token->from_account_id)
            {
                $token->update([
                    "status" => TokenStatus::CANCELLED
                ]);
                return back()->withErrors("users dont exist");
            }
        
        $token->update([
            "status" => TokenStatus::READY
        ]);

        return Inertia::render("welcome",["success" => true]);

    }
}
