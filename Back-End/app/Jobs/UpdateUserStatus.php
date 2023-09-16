<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateUserStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        // Define the threshold for considering a user inactive (e.g., 30 minutes)
        $inactiveThreshold = now()->subMinutes(30);

        // Get users whose last activity is older than the threshold
        $inactiveUsers = User::where('last_activity', '<', $inactiveThreshold)->get();
        $activeUsers = User::where('last_activity', '>', $inactiveThreshold)->get();
        // Update the status of inactive users to "inactive"
        foreach ($inactiveUsers as $user) {
            $user->status = 0;
            $user->save();
        }

        foreach ($activeUsers as $user) {
            $user->status = 1;
            $user->save();
        }
    }
}
