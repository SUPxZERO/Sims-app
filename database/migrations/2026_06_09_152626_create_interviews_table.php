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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications', 'APPLICATION_ID')->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('meeting_link')->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->text('feedback')->nullable();
            $table->string('status', 20)->default('SCHEDULED');
            $table->timestamps();
        });
        
        \Illuminate\Support\Facades\DB::statement('CREATE SEQUENCE seq_interviews START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
        \Illuminate\Support\Facades\DB::statement('DROP SEQUENCE seq_interviews');
    }
};
