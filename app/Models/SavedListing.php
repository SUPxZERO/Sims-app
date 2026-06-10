<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent as Eloquent;

class SavedListing extends Eloquent
{
    protected $table = 'saved_listings';
    protected $primaryKey = 'id';
    public $sequence = 'seq_saved_listings';
    protected $fillable = [
        'student_id',
        'listing_id',
    ];

    protected $casts = [
        'id' => 'integer',
        'student_id' => 'integer',
        'listing_id' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }

    public function listing()
    {
        return $this->belongsTo(InternshipListing::class, 'listing_id', 'listing_id');
    }
}
