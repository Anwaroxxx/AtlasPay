<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{

    protected $fillable = ["created_by_account_id","token","from_account_id","to_account_id","amount","status","expires_at","goal"];
    //
    public function user()
    {
        $this->belongsToMany(User::class);
    }
}
