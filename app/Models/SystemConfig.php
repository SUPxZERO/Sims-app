<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class SystemConfig extends Eloquent
{
    use HasFactory;

    protected $table = 'system_configs';
    protected $primaryKey = 'config_id';
    public $sequence = 'seq_system_configs';
    public $timestamps = false; // Only updated_at is tracked

    protected $fillable = [
        'config_key',
        'config_value',
        'config_type',
        'description',
        'updated_by',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'updated_by' => 'integer',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
