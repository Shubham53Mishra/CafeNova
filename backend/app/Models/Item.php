<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'cafe_id',
        'item_name',
        'description',
        'price',
        'is_available'
    ];

    public function cafe()
    {
        return $this->belongsTo(Cafe::class);
    }

    public function subitems()
    {
        return $this->hasMany(Subitem::class);
    }
}
