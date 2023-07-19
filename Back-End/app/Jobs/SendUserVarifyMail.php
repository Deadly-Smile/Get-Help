<?php

namespace App\Jobs;

use App\Mail\SignUpMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendUserVarifyMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $incommingData;
    /**
     * Create a new job instance.
     */
    public function __construct($incommingData)
    {
        $this->incommingData = $incommingData;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->incommingData["send-to"])->send(new SignUpMail($this->incommingData['data']));
    }
}
