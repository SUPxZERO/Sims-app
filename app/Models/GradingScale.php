<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class GradingScale extends Eloquent
{
    use HasFactory;

    protected $table = 'grading_scales';
    protected $primaryKey = 'grade_scale_id';
    public $sequence = 'seq_grading_scales';
    public $timestamps = false; // The schema doesn't have created_at/updated_at fields for grading_scales

    protected $fillable = [
        'letter_grade',
        'min_score',
        'max_score',
        'grade_point',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'min_score' => 'float',
            'max_score' => 'float',
            'grade_point' => 'float',
            'sort_order' => 'integer',
        ];
    }
}
