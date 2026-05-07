<?php

namespace App\Enums;

enum RedirectGoals: string
{
    //
    case STORE = 'store';
    case SENDER = 'sender';
    case SENDERPAY = 'sender_pay';
    case RECEIVER = 'receiver';
}
