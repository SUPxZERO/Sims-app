<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CompanyProfile extends Eloquent
{
    use HasFactory;

    protected $table = 'company_profiles';
    protected $primaryKey = 'company_profile_id';
    public $sequence = 'seq_company_profiles';

    protected $fillable = [
        'user_id',
        'company_name',
        'industry_sector',
        'company_size',
        'company_website',
        'company_address',
        'company_city',
        'company_description',
        'contact_person_name',
        'contact_phone',
        'is_verified',
        'verified_at',
        'verified_by',
        'company_logo_path',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'is_verified' => 'boolean',
            'verified_by' => 'integer',
            'verified_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by', 'user_id');
    }
}
