<?php

namespace App\Enums;

enum QrTypes: string
{
    //
    case STORE = 'store';
    case SENDER = 'sender';
    case SENDERPAY = 'sender_pay';
    case RECEIVER = 'receiver';
}
