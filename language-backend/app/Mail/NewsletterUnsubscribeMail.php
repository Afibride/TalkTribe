<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterUnsubscribeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject('You have been unsubscribed from TalkTribe Newsletter')
                    ->view('emails.newsletter-unsubscribe');
    }
}