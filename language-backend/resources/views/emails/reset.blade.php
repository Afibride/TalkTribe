<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      background-color: #fff;
    }

    .logo {
      margin-bottom: 20px;
    }

    .logo img {
      height: 100px;
    }

    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 25px;
      background-color: #F1A012;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }

    .btn:hover {
      background-color: #AB2526;
    }

    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
    <img src="{{ asset('images/logo.png') }}" alt="Talk Tribe Logo" />
    </div>

    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>

    <a 
  class="btn" 
  href="{{ config('app.frontend_url') }}/reset-password/{{ $token }}?email={{ urlencode($email) }}">
  Reset Password
</a>


    <p>If you didn't request this password reset, just ignore this email. Your password will remain the same.</p>

    <div class="footer">
      <p>&copy; {{ date('Y') }} Talk Tribe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
