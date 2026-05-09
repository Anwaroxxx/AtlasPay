<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Support\Facades\Request;

class TransactionPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    
    public function transfer(User $user, Request $request)
    {
        return false;
    }
}
 