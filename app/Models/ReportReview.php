<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class ReportReview extends Eloquent
{
    use HasFactory;

    protected $table = 'report_reviews';
    protected $primaryKey = 'review_id';
    public $sequence = 'seq_report_reviews';
    public $timestamps = false; // Only reviewed_at exists in schema

    protected $fillable = [
        'report_id',
        'reviewer_user_id',
        'decision',
        'comments',
    ];

    protected function casts(): array
    {
        return [
            'report_id' => 'integer',
            'reviewer_user_id' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function report()
    {
        return $this->belongsTo(WeeklyReport::class, 'report_id', 'report_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_user_id', 'user_id');
    }
}
