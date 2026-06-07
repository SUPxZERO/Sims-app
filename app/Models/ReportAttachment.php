<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class ReportAttachment extends Eloquent
{
    use HasFactory;

    protected $table = 'report_attachments';
    protected $primaryKey = 'attachment_id';
    public $sequence = 'seq_report_attachments';
    public $timestamps = false; // Only uploaded_at exists in schema

    protected $fillable = [
        'report_id',
        'file_path',
        'file_name',
        'file_size_bytes',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'report_id' => 'integer',
            'file_size_bytes' => 'integer',
            'uploaded_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function report()
    {
        return $this->belongsTo(WeeklyReport::class, 'report_id', 'report_id');
    }
}
