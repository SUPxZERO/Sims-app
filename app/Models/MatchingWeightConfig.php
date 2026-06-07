<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class MatchingWeightConfig extends Eloquent
{
    use HasFactory;

    protected $table = 'matching_weight_configs';
    protected $primaryKey = 'config_id';
    public $incrementing = false; // Singleton config table, config_id = 1 is seeded manually
    public $timestamps = false; // Only updated_at exists in schema, we cast it manually or handle it

    protected $fillable = [
        'config_id',
        'skill_weight',
        'gpa_weight',
        'preference_weight',
        'min_score_threshold',
        'max_recommendations',
        'updated_by',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'config_id' => 'integer',
            'skill_weight' => 'float',
            'gpa_weight' => 'float',
            'preference_weight' => 'float',
            'min_score_threshold' => 'float',
            'max_recommendations' => 'integer',
            'updated_by' => 'integer',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
