<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class FinalScore extends Eloquent
{
    use HasFactory;

    protected $table = 'final_scores';
    protected $primaryKey = 'final_score_id';
    public $sequence = 'seq_final_scores';
    public $timestamps = false; // Only calculated_at exists in schema

    protected $fillable = [
        'internship_id',
        'company_eval_score',
        'lecturer_grade_score',
        'attendance_score',
        'company_weight',
        'lecturer_weight',
        'attendance_weight',
        'composite_score',
        'letter_grade',
        'calculated_at',
        'calculated_by',
    ];

    protected function casts(): array
    {
        return [
            'internship_id' => 'integer',
            'company_eval_score' => 'float',
            'lecturer_grade_score' => 'float',
            'attendance_score' => 'float',
            'company_weight' => 'float',
            'lecturer_weight' => 'float',
            'attendance_weight' => 'float',
            'composite_score' => 'float',
            'calculated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function internship()
    {
        return $this->belongsTo(Internship::class, 'internship_id', 'internship_id');
    }
}
