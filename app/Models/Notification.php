<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Notification extends Eloquent
{
    use HasFactory;

    protected $table = 'notifications';
    protected $primaryKey = 'notification_id';
    public $sequence = 'seq_notifications';
    public $timestamps = false; // Only created_at exists in schema

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'priority',
        'channel',
        'reference_type',
        'reference_id',
        'is_read',
        'read_at',
        'email_sent',
        'email_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'reference_id' => 'integer',
            'is_read' => 'boolean',
            'email_sent' => 'boolean',
            'read_at' => 'datetime',
            'email_sent_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /* Scopes */

    public function scopeUnread($query)
    {
        return $query->where('is_read', 0);
    }
}
