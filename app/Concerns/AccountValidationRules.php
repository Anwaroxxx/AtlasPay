<?php

declare(strict_types=1);

use App\Account\AccountTypes;

trait AccountValidationRules
{
    protected function accountRules(): array
    {
        return ['account_type' => AccountTypes::all()];
    }
}
