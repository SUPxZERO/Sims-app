<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class JwtHelper
{
    /**
     * Generate a signed JWT token
     */
    public static function generateToken(array $payload, int $expiryMinutes = 60): string
    {
        $secret = env('JWT_SECRET', env('APP_KEY', 'default_secret_key_1234567890_abcdef'));

        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT',
        ];

        // Merge standard claims
        $now = Carbon::now()->timestamp;
        $payload = array_merge([
            'iss' => env('APP_URL', 'http://localhost'), // Issuer
            'iat' => $now,                               // Issued at
            'exp' => $now + ($expiryMinutes * 60),      // Expiration time
        ], $payload);

        $base64Header = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
        $base64Signature = self::base64UrlEncode($signature);

        return "$base64Header.$base64Payload.$base64Signature";
    }

    /**
     * Verify a JWT token and return its payload, or null if invalid/expired
     */
    public static function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64Header, $base64Payload, $base64Signature] = $parts;
        $secret = env('JWT_SECRET', env('APP_KEY', 'default_secret_key_1234567890_abcdef'));

        // Recalculate signature
        $expectedSignature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
        $expectedBase64Signature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($expectedBase64Signature, $base64Signature)) {
            return null; // Invalid signature
        }

        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        if (!$payload) {
            return null; // Invalid payload JSON
        }

        // Check expiration
        if (isset($payload['exp']) && Carbon::now()->timestamp > $payload['exp']) {
            return null; // Expired token
        }

        return $payload;
    }

    /**
     * Helper to base64Url encode
     */
    private static function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    /**
     * Helper to base64Url decode
     */
    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
