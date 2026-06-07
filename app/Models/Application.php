<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Application extends Eloquent
{
    use HasFactory;

    protected $table = 'applications';
    protected $primaryKey = 'application_id';
    public $sequence = 'seq_applications';

    protected $fillable = [
        'user_id',
        'listing_id',
        'cv_version_id',
        'cover_letter',
        'match_score_at_apply',
        'status',
        'rejection_reason',
        'submitted_at',
        'reviewed_at',
        'decided_at',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'listing_id' => 'integer',
            'cv_version_id' => 'integer',
            'match_score_at_apply' => 'float',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'decided_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'user_id', 'user_id');
    }

    public function listing()
    {
        return $this->belongsTo(InternshipListing::class, 'listing_id', 'listing_id');
    }

    public function cvVersion()
    {
        return $this->belongsTo(CvVersion::class, 'cv_version_id', 'cv_version_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(ApplicationStatusHistory::class, 'application_id', 'application_id')->orderBy('changed_at');
    }

    public function internship()
    {
        return $this->hasOne(Internship::class, 'application_id', 'application_id');
    }
}
