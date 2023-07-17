<?php

namespace App\Jobs;

use App\Mail\SignUpMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendUserVarifyMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $info;
    /**
     * Create a new job instance.
     */
    public function __construct($info)
    {
        $this->info = $info;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->info['send-to'])->send(new SignUpMail($this->info["data"]));
    }
}
