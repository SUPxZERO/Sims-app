<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('saved_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users', 'USER_ID')->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained('internship_listings', 'LISTING_ID')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['student_id', 'listing_id']);
        });

        \Illuminate\Support\Facades\DB::statement('CREATE SEQUENCE seq_saved_listings START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_listings');
        \Illuminate\Support\Facades\DB::statement('DROP SEQUENCE seq_saved_listings');
    }
};
