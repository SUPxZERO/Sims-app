<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CvEducation extends Eloquent
{
    use HasFactory;

    protected $table = 'cv_educations';
    protected $primaryKey = 'cv_education_id';
    public $sequence = 'seq_cv_educations';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'cv_id',
        'institution_name',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'gpa',
        'description',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'cv_id' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'gpa' => 'float',
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
