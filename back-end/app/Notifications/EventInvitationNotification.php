<?php

namespace App\Notifications;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Event $event,
        protected User $sender
    ) {}

    public function via(object $notifiable): array
    {
        return ['broadcast', 'database'];
    }
    public function databaseType(object $notifiable): string
    {
        return 'invitation';
    }
    public function broadcastType(): string
    {
        return 'invitation';
    }
    public function toArray(object $notifiable): array
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'sender' => $this->sender,
            'type' => 'invitation',
            'message' => "You've been invited to {$this->event->title}",
            'start_time' => $this->event->start_time,
            'location' => $this->event->location,
        ];
    }
}
