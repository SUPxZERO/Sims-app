<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class ListingRequiredSkill extends Eloquent
{
    use HasFactory;

    protected $table = 'listing_required_skills';
    protected $primaryKey = 'listing_skill_id';
    public $sequence = 'seq_listing_req_skills';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'listing_id',
        'skill_id',
        'importance',
        'importance_weight',
    ];

    protected function casts(): array
    {
        return [
            'listing_id' => 'integer',
            'skill_id' => 'integer',
            'importance_weight' => 'float',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function listing()
    {
        return $this->belongsTo(InternshipListing::class, 'listing_id', 'listing_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}
