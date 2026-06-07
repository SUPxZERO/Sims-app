<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class CvDocument extends Eloquent
{
    use HasFactory;

    protected $table = 'cv_documents';
    protected $primaryKey = 'cv_document_id';
    public $sequence = 'seq_cv_documents';
    public $timestamps = false; // Only uploaded_at exists in schema

    protected $fillable = [
        'cv_id',
        'document_label',
        'file_path',
        'file_name',
        'file_size_bytes',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'cv_id' => 'integer',
            'file_size_bytes' => 'integer',
            'uploaded_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function cv()
    {
        return $this->belongsTo(Cv::class, 'cv_id', 'cv_id');
    }
}
