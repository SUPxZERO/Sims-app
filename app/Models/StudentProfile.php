<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class StudentProfile extends Eloquent
{
    use HasFactory;

    protected $table = 'student_profiles';
    protected $primaryKey = 'student_profile_id';
    public $sequence = 'seq_student_profiles';

    protected $fillable = [
        'user_id',
        'student_id_number',
        'department',
        'faculty',
        'enrollment_year',
        'expected_graduation',
        'gpa',
        'phone_number',
        'address',
        'linkedin_url',
        'bio',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'enrollment_year' => 'integer',
            'expected_graduation' => 'integer',
            'gpa' => 'float',
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
