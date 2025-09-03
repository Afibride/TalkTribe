<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactAutoReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $subject;

    public function __construct($name, $subject)
    {
        $this->name = $name;
        $this->subject = $subject;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject('Thank you for contacting us!')
                    ->view('emails.contact-auto-reply')
                    ->with([
                        'name' => $this->name,
                        'subject' => $this->subject
                    ]);
    }
}