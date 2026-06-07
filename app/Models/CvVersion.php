<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CvVersion extends Eloquent
{
    use HasFactory;

    protected $table = 'cv_versions';
    protected $primaryKey = 'cv_version_id';
    public $sequence = 'seq_cv_versions';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'cv_id',
        'version_number',
        'snapshot_data',
    ];

    protected function casts(): array
    {
        return [
            'cv_id' => 'integer',
            'version_number' => 'integer',
            'snapshot_data' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function cv()
    {
        return $this->belongsTo(Cv::class, 'cv_id', 'cv_id');
    }
}
