<!DOCTYPE html>
<html>
<head>
    <title>Event Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h1 style="color: #4CAF50; text-align: center;">You're Invited!</h1>
        <p style="font-size: 16px;">Hello <strong>{{ $invitedUser->name }}</strong>,</p>

        <p style="font-size: 16px;">You have been invited to attend the event <strong>"{{ $event->title }}"</strong>.</p>

        <h2 style="color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Event Details:</h2>
        <p><strong>Date:</strong> {{ $event->start_date }}</p>
        <p><strong>Location:</strong> {{ $event->location }}</p>
        <p><strong>Description:</strong> {{ $event->description }}</p>

        <p style="font-size: 16px;">Please respond to this invitation by clicking the link below:</p>

        <div style="text-align: center; margin-top: 20px;">
            <a href="{{ config('app.frontend_url') }}/notifications" 
               style="display: inline-block; padding: 10px 20px; margin: 5px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">Go to Notifications</a>
        </div>
    </div>
</body>
</html>
