<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

class StudentPreference extends Eloquent
{
    protected $table = 'student_preferences';
    protected $primaryKey = 'id';
    public $sequence = 'seq_student_preferences';
    protected $fillable = [
        'student_id',
        'preferred_locations',
        'preferred_work_modes',
        'preferred_industries',
    ];

    protected $casts = [
        'id' => 'integer',
        'student_id' => 'integer',
        'preferred_locations' => 'array',
        'preferred_work_modes' => 'array',
        'preferred_industries' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }
}
