<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Event $event
    ) {}

    public function via(object $notifiable): array
    {
        // Get user's notification preferences for this event
        $preferences = $notifiable->notificationPreferences()
            ->where('event_id', $this->event->id)
            ->first();

        if (!$preferences) {
            return ['database'];
        }

        $channels = ['database'];
        if ($preferences->email_notification) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Reminder: {$this->event->title}")
            ->line("This is a reminder for your upcoming event: {$this->event->title}")
            ->line("Event details:")
            ->line("Date: " . $this->event->start_time->format('Y-m-d H:i'))
            ->line("Location: {$this->event->location}")
            ->action('View Event', url("/calendar?event={$this->event->id}"))
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'type' => 'reminder',
            'message' => "Reminder: {$this->event->title} starts soon",
            'start_time' => $this->event->start_time,
            'location' => $this->event->location,
        ];
    }
}
