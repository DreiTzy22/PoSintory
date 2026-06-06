<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Super admins are never blocked
        if ($user && $user->role === 'super_admin') {
            return $next($request);
        }

        // Check if user belongs to a tenant and if that tenant is disabled
        if ($user && $user->tenant_id) {
            $tenant = \App\Models\Tenant::find($user->tenant_id);
            if ($tenant && $tenant->status === 'disabled') {
                return response()->json([
                    'message' => 'Your business account has been disabled by the system administrator.',
                    'account_status' => 'disabled'
                ], 403);
            }
        }

        return $next($request);
    }
}
