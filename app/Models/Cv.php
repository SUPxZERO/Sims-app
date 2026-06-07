<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Cv extends Eloquent
{
    use HasFactory;

    protected $table = 'cvs';
    protected $primaryKey = 'cv_id';
    public $sequence = 'seq_cvs';

    protected $fillable = [
        'user_id',
        'personal_summary',
        'status',
        'visibility',
        'current_version',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'current_version' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function educations()
    {
        return $this->hasMany(CvEducation::class, 'cv_id', 'cv_id')->orderBy('sort_order');
    }

    public function experiences()
    {
        return $this->hasMany(CvExperience::class, 'cv_id', 'cv_id')->orderBy('sort_order');
    }

    public function documents()
    {
        return $this->hasMany(CvDocument::class, 'cv_id', 'cv_id');
    }

    public function versions()
    {
        return $this->hasMany(CvVersion::class, 'cv_id', 'cv_id');
    }

    public function cvSkills()
    {
        return $this->hasMany(CvSkill::class, 'cv_id', 'cv_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'cv_skills', 'cv_id', 'skill_id')
                    ->withPivot('proficiency_level', 'proficiency_weight', 'cv_skill_id');
    }
}
