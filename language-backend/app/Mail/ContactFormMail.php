<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $email;
    public $subject;
    public $message;

    public function __construct($name, $email, $subject, $message)
    {
        $this->name = $name;
        $this->email = $email;
        $this->subject = $subject;
        $this->message = $message;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->replyTo($this->email, $this->name)
                    ->subject('TalkTribe User: ' . $this->subject)
                    ->view('emails.contact')
                    ->with([
                        'name' => $this->name,
                        'email' => $this->email,
                        'subject' => $this->subject,
                        'messageContent' => $this->message
                    ]);
    }
}