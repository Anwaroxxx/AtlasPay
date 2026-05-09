<?php

declare(strict_types=1);

namespace App\Services;
use App\Models\Account;

class GenerateRibService
{
    public static function generateAccountId(int $bankCode = 230,int $city_code = 212)
    {
        $random_account_num = random_int(0,9999999999999999);

        do{
            $account_number = str_pad((string)$bankCode,3,"0",STR_PAD_LEFT) . 
                                str_pad((string)$city_code,3,"0",STR_PAD_LEFT) .
                                str_pad((string)$random_account_num,16,"0",STR_PAD_LEFT);
        }while(Account::where("account_number",$account_number)->exists());
        return  $account_number;
    }
}