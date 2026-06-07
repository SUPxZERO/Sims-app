<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class LecturerProfile extends Eloquent
{
    use HasFactory;

    protected $table = 'lecturer_profiles';
    protected $primaryKey = 'lecturer_profile_id';
    public $sequence = 'seq_lecturer_profiles';

    protected $fillable = [
        'user_id',
        'staff_id_number',
        'department',
        'faculty',
        'specialization',
        'max_supervision_load',
        'phone_number',
        'office_location',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'max_supervision_load' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
