<?php

namespace App\Enums;

enum TokenStatus: string
{
    //
    case PENDING = 'pending';
    case READY = 'ready';
    case COMPLETED = 'completed';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';
}
