<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class ApplicationStatusHistory extends Eloquent
{
    use HasFactory;

    protected $table = 'application_status_history';
    protected $primaryKey = 'history_id';
    public $sequence = 'seq_app_status_history';
    public $timestamps = false; // Only changed_at is used

    protected $fillable = [
        'application_id',
        'from_status',
        'to_status',
        'changed_by',
        'change_reason',
        'changed_at',
    ];

    protected function casts(): array
    {
        return [
            'application_id' => 'integer',
            'changed_by' => 'integer',
            'changed_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'application_id');
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by', 'user_id');
    }
}
