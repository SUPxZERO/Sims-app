<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CvExperience extends Eloquent
{
    use HasFactory;

    protected $table = 'cv_experiences';
    protected $primaryKey = 'cv_experience_id';
    public $sequence = 'seq_cv_experiences';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'cv_id',
        'company_name',
        'position_title',
        'start_date',
        'end_date',
        'description',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'cv_id' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'sort_order' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function cv()
    {
        return $this->belongsTo(Cv::class, 'cv_id', 'cv_id');
    }
}
