<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribe from Newsletter - TalkTribe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 500px;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #188B81;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        button {
            background-color: #188B81;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #146c63;
        }
        .success {
            color: green;
            margin-top: 10px;
        }
        .error {
            color: red;
            margin-top: 10px;
        }
        .already-unsubscribed {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Unsubscribe from Newsletter</h2>
        
        @if(isset($subscriber) && $subscriber->unsubscribed_at)
            <div class="already-unsubscribed">
                <p>This email address ({{ $email }}) is already unsubscribed from our newsletter.</p>
                <p>If you'd like to resubscribe, <a href="#" id="resubscribe-link">click here</a>.</p>
            </div>
        @else
            <form id="unsubscribeForm">
                @csrf
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" value="{{ $email ?? '' }}" required>
                </div>
                
                <div class="form-group">
                    <label for="reason">Reason for unsubscribing (optional)</label>
                    <select id="reason" name="reason">
                        <option value="">Select a reason...</option>
                        <option value="too_many_emails">Too many emails</option>
                        <option value="content_not_relevant">Content not relevant</option>
                        <option value="not_interested">Not interested anymore</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group" id="otherReason" style="display: none;">
                    <label for="other_reason">Please specify</label>
                    <textarea id="other_reason" name="other_reason" rows="3"></textarea>
                </div>
                
                <button type="submit">Unsubscribe</button>
                
                <div id="message"></div>
            </form>
        @endif
    </div>

    <script>
        document.getElementById('reason').addEventListener('change', function() {
            const otherReason = document.getElementById('otherReason');
            otherReason.style.display = this.value === 'other' ? 'block' : 'none';
        });

        document.getElementById('unsubscribeForm')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const messageDiv = document.getElementById('message');
            
            try {
                const response = await fetch('/api/newsletter/unsubscribe', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    messageDiv.className = 'success';
                    messageDiv.innerHTML = data.message;
                    document.getElementById('unsubscribeForm').reset();
                } else {
                    messageDiv.className = 'error';
                    messageDiv.innerHTML = data.message;
                }
            } catch (error) {
                messageDiv.className = 'error';
                messageDiv.innerHTML = 'An error occurred. Please try again.';
            }
        });

        document.getElementById('resubscribe-link')?.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/newsletter/resubscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        email: '{{ $email }}'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Successfully resubscribed!');
                    window.location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
        });
    </script>
</body>
</html>