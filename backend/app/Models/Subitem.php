<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subitem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'subitem_name',
        'description',
        'additional_price',
        'is_available'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
