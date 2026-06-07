<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class EvaluationCriteria extends Eloquent
{
    use HasFactory;

    protected $table = 'evaluation_criteria';
    protected $primaryKey = 'criteria_id';
    public $sequence = 'seq_evaluation_criteria';

    protected $fillable = [
        'criteria_name',
        'description',
        'weight',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'float',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
        ];
    }
}
