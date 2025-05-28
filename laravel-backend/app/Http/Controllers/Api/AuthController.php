<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Password;
use Exception;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'remember_me' => 'boolean',
            'session_timeout' => 'integer|min:1|max:480' // Max 8 hours
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only(['email', 'password']);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Create token with custom expiration if remember_me is checked
        $tokenName = 'auth_token';
        
        // Fixed: Simplified token creation (Laravel Sanctum handles expiration differently)
        if ($request->boolean('remember_me')) {
            $token = $user->createToken($tokenName, ['*']);
            // Set expiration manually if needed
            $token->accessToken->expires_at = now()->addDays(30);
            $token->accessToken->save();
        } else {
            $token = $user->createToken($tokenName, ['*']);
            $sessionTimeout = $request->input('session_timeout', 30); // Default 30 minutes
            $token->accessToken->expires_at = now()->addMinutes($sessionTimeout);
            $token->accessToken->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'redirect_url' => '/dashboard', // Frontend expects this
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'company_id' => $user->company_id,
                ],
                'token' => $token->plainTextToken,
                'token_type' => 'Bearer',
                'expires_at' => $token->accessToken->expires_at?->toISOString()
            ]
        ]);
    }

    /**
     * Initialize SSO login (placeholder implementation)
     */
    public function initSSO(Request $request): JsonResponse
    {
        try {
            // For now, return a placeholder response
            // You'll need to implement actual SSO logic based on your provider (SAML, OAuth, etc.)
            // Example for different SSO providers:
            // - Microsoft Azure AD: redirect to Azure OAuth endpoint
            // - Google Workspace: redirect to Google OAuth endpoint
            // - SAML: redirect to SAML IdP

            return response()->json([
                'redirect_url' => config('app.url') . '/auth/sso/redirect', // Placeholder
                'message' => 'SSO initialization successful',
                'provider' => 'corporate-sso'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'SSO initialization failed: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'company_id' => 'nullable|exists:companies,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => $request->company_id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'company_id' => $user->company_id,
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'company_id' => $user->company_id,
                    'company' => $user->company
                ]
            ]
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $request->user()->currentAccessToken()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['message' => __($status)])
                    : response()->json(['email' => __($status)], 400);
    }
}