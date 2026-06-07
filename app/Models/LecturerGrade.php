<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class LecturerGrade extends Eloquent
{
    use HasFactory;

    protected $table = 'lecturer_grades';
    protected $primaryKey = 'grade_id';
    public $sequence = 'seq_lecturer_grades';

    protected $fillable = [
        'internship_id',
        'grader_user_id',
        'report_quality_score',
        'presentation_score',
        'engagement_score',
        'composite_score',
        'overall_comments',
        'status',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'internship_id' => 'integer',
            'grader_user_id' => 'integer',
            'report_quality_score' => 'float',
            'presentation_score' => 'float',
            'engagement_score' => 'float',
            'composite_score' => 'float',
            'submitted_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function internship()
    {
        return $this->belongsTo(Internship::class, 'internship_id', 'internship_id');
    }

    public function grader()
    {
        return $this->belongsTo(User::class, 'grader_user_id', 'user_id');
    }
}
