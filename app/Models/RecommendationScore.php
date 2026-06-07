<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class RecommendationScore extends Eloquent
{
    use HasFactory;

    protected $table = 'recommendation_scores';
    protected $primaryKey = 'recommendation_id';
    public $sequence = 'seq_recommendation_scores';
    public $timestamps = false; // Only calculated_at exists in schema

    protected $fillable = [
        'user_id',
        'listing_id',
        'skill_match_score',
        'gpa_match_score',
        'preference_match_score',
        'composite_score',
        'skill_weight_used',
        'gpa_weight_used',
        'preference_weight_used',
        'matched_skills_count',
        'total_required_skills',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'listing_id' => 'integer',
            'skill_match_score' => 'float',
            'gpa_match_score' => 'float',
            'preference_match_score' => 'float',
            'composite_score' => 'float',
            'skill_weight_used' => 'float',
            'gpa_weight_used' => 'float',
            'preference_weight_used' => 'float',
            'matched_skills_count' => 'integer',
            'total_required_skills' => 'integer',
            'calculated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function listing()
    {
        return $this->belongsTo(InternshipListing::class, 'listing_id', 'listing_id');
    }
}
