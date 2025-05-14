<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            $url = str_replace(config('app.url')."/api", config('app.frontend_url') . "/verify?end=", $url);
            return (new MailMessage)
                ->subject('Verify Email Address')
                ->view('emails.verify-email', ['url' => $url]);
        });
    }
}
