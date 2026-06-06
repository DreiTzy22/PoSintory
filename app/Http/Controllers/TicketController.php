<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'tenant']);
        
        if ($request->user()->isSuperAdmin()) {
            $query->withoutGlobalScopes();
        }

        return $query->latest()->paginate(25);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'category' => 'nullable|string|in:bug,error,concern,feature_request',
        ]);

        $ticket = Ticket::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'tenant_id' => $request->user()->tenant_id,
        ]);

        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket, Request $request)
    {
        if ($request->user()->isSuperAdmin()) {
            return $ticket->load(['user', 'tenant']);
        }
        return $ticket->load('user');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed',
        ]);

        // Only super admin can update status for now, or the owner can close it
        $ticket->update($validated);
        return $ticket;
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->noContent();
    }
}
