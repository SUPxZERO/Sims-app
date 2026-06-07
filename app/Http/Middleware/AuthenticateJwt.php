<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\JwtHelper;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateJwt
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorization = $request->header('Authorization');
        if (!$authorization || !str_starts_with($authorization, 'Bearer ')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $token = substr($authorization, 7);
        $payload = JwtHelper::verifyToken($token);

        if (!$payload || !isset($payload['sub'])) {
            return response()->json(['message' => 'Unauthenticated. Invalid or expired token.'], 401);
        }

        $user = User::find($payload['sub']);
        if (!$user || $user->status !== 'ACTIVE') {
            return response()->json(['message' => 'Unauthenticated. User is inactive or not found.'], 401);
        }

        // Bind user to authentication guards for this request cycle
        Auth::setUser($user);
        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
