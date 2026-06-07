<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class SkillCategory extends Eloquent
{
    use HasFactory;

    protected $table = 'skill_categories';
    protected $primaryKey = 'skill_category_id';
    public $sequence = 'seq_skill_categories';
    const UPDATED_AT = null;

    protected $fillable = [
        'category_name',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function skills()
    {
        return $this->hasMany(Skill::class, 'skill_category_id', 'skill_category_id');
    }
}
