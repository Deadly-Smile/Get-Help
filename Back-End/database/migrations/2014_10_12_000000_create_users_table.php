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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("username")->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('balance')->default(0);
            $table->string('remember_token', 511)->nullable()->change();
            $table->string("verify_token")->nullable()->default(null);
            $table->string('avatar')->nullable()->default(null);
            $table->string('document')->nullable()->default(null);
            $table->string('mobile')->nullable()->default(null);
            $table->string('nid_card_number')->nullable()->default(null)->unique();
            $table->string('country')->nullable()->default(null);
            $table->string('district')->nullable()->default(null);
            $table->string('address')->nullable()->default(null);
            $table->date('date_of_birth')->nullable()->default(null);
            $table->boolean('pending_subscriber')->nullable()->default(true);
            $table->boolean('pending_doctor')->nullable()->default(null);
            $table->boolean('pending_admin')->nullable()->default(null);
            $table->integer('status')->default(0);
            $table->timestamp('last_activity')->default(now());
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
