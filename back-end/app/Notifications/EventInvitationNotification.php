<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Event $event
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("You're invited to: {$this->event->title}")
            ->line("You have been invited to attend {$this->event->title}")
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
            'type' => 'invitation',
            'message' => "You've been invited to {$this->event->title}",
            'start_time' => $this->event->start_time,
            'location' => $this->event->location,
        ];
    }
}