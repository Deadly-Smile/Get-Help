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
        Schema::create('tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('creator_id');
            $table->string('token')->unique();
            $table->unsignedBigInteger('handler_id')->nullable();
            $table->boolean('is_used')->default(false);
            $table->unsignedBigInteger('used_user_id')->nullable();
            $table->string('value');
            $table->timestamps();

            // Define foreign keys if needed
            $table->foreign('creator_id')->references('id')->on('users');
            $table->foreign('handler_id')->references('id')->on('users');
            $table->foreign('used_user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
