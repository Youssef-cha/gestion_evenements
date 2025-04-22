<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\EventNotificationPreference;
use App\Notifications\EventReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendEventReminders extends Command
{
    protected $signature = 'events:send-reminders';
    protected $description = 'Send reminders for upcoming events';

    public function handle()
    {
        $now = Carbon::now();

        // Get all notification preferences for upcoming events
        $preferences = EventNotificationPreference::whereHas('event', function ($query) use ($now) {
            $query->where('start_time', '>', $now);
        })->with('event', 'user')->get();

        foreach ($preferences as $preference) {
            $event = $preference->event;
            $reminderTime = Carbon::parse($event->start_time)->subMinutes($preference->minutes_before);

            // If it's time to send the reminder (within the last minute)
            if ($now->diffInMinutes($reminderTime, false) <= 0 && $now->diffInMinutes($reminderTime) < 1) {
                $preference->user->notify(new EventReminderNotification($event));
                $this->info("Sent reminder for event {$event->title} to user {$preference->user->name}");
            }
        }
    }
}
