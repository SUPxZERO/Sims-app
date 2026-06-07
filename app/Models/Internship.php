<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Internship extends Eloquent
{
    use HasFactory;

    protected $table = 'internships';
    protected $primaryKey = 'internship_id';
    public $sequence = 'seq_internships';

    protected $fillable = [
        'application_id',
        'student_user_id',
        'company_user_id',
        'lecturer_user_id',
        'listing_id',
        'start_date',
        'end_date',
        'total_weeks',
        'status',
        'confirmed_by',
        'report_deadline_day',
    ];

    protected function casts(): array
    {
        return [
            'application_id' => 'integer',
            'student_user_id' => 'integer',
            'company_user_id' => 'integer',
            'lecturer_user_id' => 'integer',
            'listing_id' => 'integer',
            'total_weeks' => 'integer',
            'confirmed_by' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'application_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_user_id', 'user_id');
    }

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'student_user_id', 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(User::class, 'company_user_id', 'user_id');
    }

    public function companyProfile()
    {
        return $this->belongsTo(CompanyProfile::class, 'company_user_id', 'user_id');
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_user_id', 'user_id');
    }

    public function lecturerProfile()
    {
        return $this->belongsTo(LecturerProfile::class, 'lecturer_user_id', 'user_id');
    }

    public function listing()
    {
        return $this->belongsTo(InternshipListing::class, 'listing_id', 'listing_id');
    }

    public function confirmer()
    {
        return $this->belongsTo(User::class, 'confirmed_by', 'user_id');
    }

    public function weeklyReports()
    {
        return $this->hasMany(WeeklyReport::class, 'internship_id', 'internship_id')->orderBy('week_number');
    }

    public function companyEvaluation()
    {
        return $this->hasOne(CompanyEvaluation::class, 'internship_id', 'internship_id');
    }

    public function lecturerGrade()
    {
        return $this->hasOne(LecturerGrade::class, 'internship_id', 'internship_id');
    }

    public function finalScore()
    {
        return $this->hasOne(FinalScore::class, 'internship_id', 'internship_id');
    }
}
