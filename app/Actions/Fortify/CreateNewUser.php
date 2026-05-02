<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Account;
use App\Models\AccountTypes;
use App\Models\User;
use App\Services\GenerateRibService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // dd($input);
        Validator::make($input, [
            ...$this->profileRules(),
            'account' => ["required", Rule::in(AccountTypes::pluck('name'))],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'phone' => $input['phone'],
            'email' => $input['email'],
            'password' => $input['password'],
            'address' => $input['address'],
            'goverment_id' => $input["goverment_id"]
        ]);

        // creating an account 

        Account::create([
            "user_id" => $user->id,
            'account_number' => GenerateRibService::generateAccountId(),
            'type' => 'wallet',
            'status' => 'active'
        ]);

        Account::create([
            "user_id" => $user->id,
            'account_number' => GenerateRibService::generateAccountId(),
            'type' => $input["account"],
            'status' => 'active'
        ]);


        return $user ;
    }
}
