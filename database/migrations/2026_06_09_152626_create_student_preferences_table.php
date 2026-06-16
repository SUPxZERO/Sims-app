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
        Schema::create('student_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users', 'USER_ID')->cascadeOnDelete();
            $table->json('preferred_locations')->nullable();
            $table->json('preferred_work_modes')->nullable();
            $table->json('preferred_industries')->nullable();
            $table->timestamps();
        });
        
        \Illuminate\Support\Facades\DB::statement('CREATE SEQUENCE seq_student_preferences START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_preferences');
        \Illuminate\Support\Facades\DB::statement('DROP SEQUENCE seq_student_preferences');
    }
};
