<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cafe extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'cafe_name',
        'cafe_description',
        'address',
        'city',
        'state',
        'pincode',
        'latitude',
        'longitude',
        'is_active'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function images()
    {
        return $this->hasMany(CafeImage::class);
    }
}
