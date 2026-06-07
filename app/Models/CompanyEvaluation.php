<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CompanyEvaluation extends Eloquent
{
    use HasFactory;

    protected $table = 'company_evaluations';
    protected $primaryKey = 'evaluation_id';
    public $sequence = 'seq_company_evaluations';

    protected $fillable = [
        'internship_id',
        'evaluator_user_id',
        'composite_score',
        'strengths',
        'improvements',
        'overall_comments',
        'hiring_recommendation',
        'status',
        'is_late',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'internship_id' => 'integer',
            'evaluator_user_id' => 'integer',
            'composite_score' => 'float',
            'is_late' => 'boolean',
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

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_user_id', 'user_id');
    }

    public function criteriaScores()
    {
        return $this->hasMany(EvaluationCriteriaScore::class, 'evaluation_id', 'evaluation_id');
    }

    public function criteria()
    {
        return $this->belongsToMany(EvaluationCriteria::class, 'evaluation_criteria_scores', 'evaluation_id', 'criteria_id')
                    ->withPivot('score', 'criteria_score_id');
    }
}
