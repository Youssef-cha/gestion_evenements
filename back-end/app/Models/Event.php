<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'event_category_id',
        'start_time',
        'end_time',
        'location',
    ];
    protected $with = ['category','attendees'];
    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_attendees')
            ->withPivot('status')
            ->withTimestamps();
    }
}
