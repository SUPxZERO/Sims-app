<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Skill extends Eloquent
{
    use HasFactory;

    protected $table = 'skills';
    protected $primaryKey = 'skill_id';
    public $sequence = 'seq_skills';
    public $timestamps = false; // The schema only has created_at, no updated_at for skills table

    protected $fillable = [
        'skill_category_id',
        'skill_name',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'skill_category_id' => 'integer',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function category()
    {
        return $this->belongsTo(SkillCategory::class, 'skill_category_id', 'skill_category_id');
    }

    public function cvs()
    {
        return $this->belongsToMany(Cv::class, 'cv_skills', 'skill_id', 'cv_id')
                    ->withPivot('proficiency_level', 'proficiency_weight', 'cv_skill_id');
    }
}
