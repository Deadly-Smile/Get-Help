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
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->default(null);
            $table->string('document')->nullable()->default(null);
            $table->string('mobile')->nullable()->default(null);
            $table->string('nid_card_number')->nullable()->default(null)->unique();
            $table->string('country')->nullable()->default(null);
            $table->string('district')->nullable()->default(null);
            $table->string('address')->nullable()->default(null);
            $table->date('data_of_birth')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'document',
                'mobile',
                'nid_card_number',
                'country',
                'district',
                'address',
                'data_of_birth',
            ]);
        });
    }
};
