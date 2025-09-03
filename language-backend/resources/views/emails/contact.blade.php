<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Form Submission</title>
</head>
<body>
    <h2>New Contact Form Submission from ?TalkTribe</h2>
    
    <p><strong>Name:</strong> {{ $name }}</p>
    <p><strong>Email:</strong> {{ $email }}</p>
    <p><strong>Subject:</strong> {{ $subject }}</p>
    
    <h3>Message:</h3>
    <p>{{ $messageContent }}</p>
    
    <hr>
    <p>This email was sent from the contact form on your website.</p>
</body>
</html>