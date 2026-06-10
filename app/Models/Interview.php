<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

class Interview extends Eloquent
{
    protected $table = 'interviews';
    protected $primaryKey = 'id';
    public $sequence = 'seq_interviews';
    protected $fillable = [
        'application_id',
        'scheduled_at',
        'meeting_link',
        'duration_minutes',
        'feedback',
        'status',
    ];

    protected $casts = [
        'id' => 'integer',
        'application_id' => 'integer',
        'duration_minutes' => 'integer',
        'scheduled_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'application_id');
    }
}
