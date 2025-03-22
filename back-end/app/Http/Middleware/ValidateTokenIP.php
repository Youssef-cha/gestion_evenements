<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateTokenIP
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $token = $request->user()->currentAccessToken();
        if ($ip !== $token->ip_address) {
            $token->delete();
            return response(['errors' => ['ip' => ['Unauthorized']]], 401);
        }
        return $next($request);
    }
}
