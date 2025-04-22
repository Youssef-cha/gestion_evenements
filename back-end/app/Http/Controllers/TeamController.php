<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        $teams = $user->teams()
            ->withCount(['members as member_count'])
            ->with("members:id,name,email,avatar")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $team = Auth::user()->ownedTeams()->create($data);

        // Add the creator as a team member
        $team->members()->attach(Auth::id());
        $team->loadCount(['members as member_count']);
        return response()->json($team, 201);
    }


    public function update(Request $request, Team $team)
    {
        if ($team->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $team->update($data);

        return response()->json($team);
    }

    public function destroy(Team $team)
    {
        if ($team->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $team->delete();

        return response()->json(null, 204);
    }

    public function addMembers(Request $request, Team $team)
    {
        if ($team->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $team->members()->attach($data['user_ids']);

        $members = $team->members;

        return response()->json($members);
    }

    public function removeMembers(Request $request, Team $team)
    {
        if ($team->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        // Don't allow removing the team owner
        if (in_array($team->user_id, $data['user_ids'])) {
            return response()->json(['message' => 'Cannot remove team owner'], 422);
        }

        $team->members()->detach($data['user_ids']);

        return response()->json($team->load('members'));
    }

    public function toggleFavorite(Team $team)
    {
        if (!$team->members->contains(Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $team->update(['is_favorite' => !$team->is_favorite]);

        return response()->json($team);
    }
}
