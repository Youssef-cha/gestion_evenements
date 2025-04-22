<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventNotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'minutes_before',
        'email_notification',
        'in_app_notification',
    ];

    protected $casts = [
        'email_notification' => 'boolean',
        'in_app_notification' => 'boolean',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
