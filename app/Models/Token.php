<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{

    protected $fillable = ["created_by_account_id","token","from_account_id","to_account_id","amount","status","expires_at","goal"];
    
    public function fromAccount()
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }

    public function toAccount()
    {
        return $this->belongsTo(Account::class, 'to_account_id');
    }

    public function creatorAccount()
    {
        return $this->belongsTo(Account::class, 'created_by_account_id');
    }
}
