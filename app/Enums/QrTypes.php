<?php

namespace App\Enums;

enum QrTypes: string
{
    case STORE = 'store';
    case SENDER = 'sender';
    case RECEIVER = 'receiver';
}
