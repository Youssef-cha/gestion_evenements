<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;
    public function category() {
        return $this->belongsTo(EventCategory::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
    public function reminders(){
        return $this->hasMany(Reminder::class);
    }
}
