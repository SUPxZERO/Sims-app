<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class AuditLog extends Eloquent
{
    use HasFactory;

    protected $table = 'audit_logs';
    protected $primaryKey = 'audit_id';
    public $sequence = 'seq_audit_logs';
    public $timestamps = false; // Custom changed_at is used instead of standard timestamps

    protected $fillable = [
        'table_name',
        'record_id',
        'action',
        'old_values',
        'new_values',
        'changed_by',
        'changed_at',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'record_id' => 'integer',
            'changed_by' => 'integer',
            'changed_at' => 'datetime',
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by', 'user_id');
    }
}
