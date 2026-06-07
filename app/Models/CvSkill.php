<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CvSkill extends Eloquent
{
    use HasFactory;

    protected $table = 'cv_skills';
    protected $primaryKey = 'cv_skill_id';
    public $sequence = 'seq_cv_skills';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'cv_id',
        'skill_id',
        'proficiency_level',
        'proficiency_weight',
    ];

    protected function casts(): array
    {
        return [
            'cv_id' => 'integer',
            'skill_id' => 'integer',
            'proficiency_weight' => 'float',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function cv()
    {
        return $this->belongsTo(Cv::class, 'cv_id', 'cv_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}
