<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tipe extends Model
{
    protected $table = 'tipes';

    protected $fillable = ['nama'];

    public function barangs(): HasMany
    {
        return $this->hasMany(Barang::class);
    }
}
