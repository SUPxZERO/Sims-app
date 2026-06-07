<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class User extends Eloquent implements AuthenticatableContract
{
    use HasFactory;

    use Authenticatable, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $sequence = 'seq_users';

    protected $fillable = [
        'email',
        'password_hash',
        'full_name',
        'role',
        'status',
        'email_verified_at',
        'failed_login_attempts',
        'locked_until',
        'last_login_at',
        'profile_photo_path',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'locked_until' => 'datetime',
            'last_login_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Override standard Laravel password attribute location.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /* Relationships */

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class, 'user_id', 'user_id');
    }

    public function lecturerProfile()
    {
        return $this->hasOne(LecturerProfile::class, 'user_id', 'user_id');
    }

    public function companyProfile()
    {
        return $this->hasOne(CompanyProfile::class, 'user_id', 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'changed_by', 'user_id');
    }
}
