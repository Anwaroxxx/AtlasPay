<?php

namespace App\Enums;

enum TransactionStatus: string
{
    //
    case ACTIVE = 'active';
    case FROZEN = 'frozen';
    case CLOSED = 'closed';
}
