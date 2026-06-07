<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class WeeklyReport extends Eloquent
{
    use HasFactory;

    protected $table = 'weekly_reports';
    protected $primaryKey = 'report_id';
    public $sequence = 'seq_weekly_reports';

    protected $fillable = [
        'internship_id',
        'week_number',
        'week_start_date',
        'week_end_date',
        'activities',
        'challenges',
        'learnings',
        'hours_logged',
        'status',
        'is_late',
        'revision_count',
        'submitted_at',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'internship_id' => 'integer',
            'week_number' => 'integer',
            'hours_logged' => 'float',
            'is_late' => 'boolean',
            'revision_count' => 'integer',
            'week_start_date' => 'date',
            'week_end_date' => 'date',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function internship()
    {
        return $this->belongsTo(Internship::class, 'internship_id', 'internship_id');
    }

    public function attachments()
    {
        return $this->hasMany(ReportAttachment::class, 'report_id', 'report_id');
    }

    public function reviews()
    {
        return $this->hasMany(ReportReview::class, 'report_id', 'report_id')->orderBy('reviewed_at');
    }
}
