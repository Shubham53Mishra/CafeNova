<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CafeImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'cafe_id',
        'image_path',
        'image_url',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function cafe()
    {
        return $this->belongsTo(Cafe::class);
    }
}
