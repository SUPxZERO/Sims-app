<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class InternshipListing extends Eloquent
{
    use HasFactory;

    protected $table = 'internship_listings';
    protected $primaryKey = 'listing_id';
    public $sequence = 'seq_internship_listings';

    protected $fillable = [
        'company_user_id',
        'title',
        'description',
        'requirements',
        'location',
        'work_mode',
        'duration_weeks',
        'quota',
        'filled_count',
        'stipend_info',
        'application_deadline',
        'status',
        'admin_feedback',
        'approved_by',
        'published_at',
        'min_gpa',
        'preferred_departments',
    ];

    protected function casts(): array
    {
        return [
            'company_user_id' => 'integer',
            'duration_weeks' => 'integer',
            'quota' => 'integer',
            'filled_count' => 'integer',
            'approved_by' => 'integer',
            'min_gpa' => 'float',
            'application_deadline' => 'date',
            'published_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function company()
    {
        return $this->belongsTo(User::class, 'company_user_id', 'user_id');
    }

    public function companyProfile()
    {
        return $this->belongsTo(CompanyProfile::class, 'company_user_id', 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }

    public function listingRequiredSkills()
    {
        return $this->hasMany(ListingRequiredSkill::class, 'listing_id', 'listing_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'listing_required_skills', 'listing_id', 'skill_id')
                    ->withPivot('importance', 'importance_weight', 'listing_skill_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'listing_id', 'listing_id');
    }

    public function internships()
    {
        return $this->hasMany(Internship::class, 'listing_id', 'listing_id');
    }
}
