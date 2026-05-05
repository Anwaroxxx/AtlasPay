<?php

namespace App\Enums;

enum RedirectGoals: string
{
    //
    case STORE = 'store';
    case SENDER = 'sender';
    case RECEIVER = 'receiver';
}
