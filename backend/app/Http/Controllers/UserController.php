<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Manual scoping for User model since BelongsToTenant was removed
        if (Auth::user()->role !== 'super_admin') {
            $query->where('tenant_id', Auth::user()->tenant_id);
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        return $query->latest('id')->paginate($request->get('per_page', 25));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:tenant_admin,staff,cashier',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'tenant_id' => Auth::user()->tenant_id,
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        // Check access
        if (Auth::user()->role !== 'super_admin' && $user->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }
        return $user;
    }

    public function update(Request $request, User $user)
    {
        // Check access
        if (Auth::user()->role !== 'super_admin' && $user->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|string|in:tenant_admin,staff,cashier',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        if (!empty($validated['role'])) {
            $data['role'] = $validated['role'];
        }

        $user->update($data);
        return $user;
    }

    public function destroy(User $user)
    {
        // Check access
        if (Auth::user()->role !== 'super_admin' && $user->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        if ($user->id == Auth::id()) {
            return response()->json(['message' => 'Cannot delete yourself.'], 403);
        }
        $user->delete();
        return response()->noContent();
    }
}
