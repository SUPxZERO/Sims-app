<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class EvaluationCriteriaScore extends Eloquent
{
    use HasFactory;

    protected $table = 'evaluation_criteria_scores';
    protected $primaryKey = 'criteria_score_id';
    public $sequence = 'seq_eval_criteria_scores';
    public $timestamps = false; // No timestamps exist in the schema for this pivot

    protected $fillable = [
        'evaluation_id',
        'criteria_id',
        'score',
    ];

    protected function casts(): array
    {
        return [
            'evaluation_id' => 'integer',
            'criteria_id' => 'integer',
            'score' => 'float',
        ];
    }

    /* Relationships */

    public function evaluation()
    {
        return $this->belongsTo(CompanyEvaluation::class, 'evaluation_id', 'evaluation_id');
    }

    public function criteria()
    {
        return $this->belongsTo(EvaluationCriteria::class, 'criteria_id', 'criteria_id');
    }
}
