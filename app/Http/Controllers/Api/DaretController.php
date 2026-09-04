<?php

namespace App\Http\Controllers\Api;

use App\Events\DaretInvitationReceived;
use App\Http\Controllers\Controller;
use App\Models\DaretGroup;
use App\Models\DaretMember;
use App\Models\Transaction;
use App\Models\User;
use App\Services\DaretService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DaretController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'myGroups' => $user->daretGroups()->with(['members.user', 'creator'])->get(),
            'pendingInvitations' => DaretMember::where('user_id', $user->id)
                ->where('status', 'pending')
                ->with(['group.creator', 'group.members.user'])
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'monthly_amount' => 'required|numeric|min:100',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
        ]);

        if (in_array($request->user()->id, $request->member_ids)) {
            throw ValidationException::withMessages([
                'member_ids' => 'You are added automatically; do not include yourself.',
            ]);
        }

        $group = DB::transaction(function () use ($request) {
            $group = DaretGroup::create([
                'name' => $request->name,
                'monthly_amount' => $request->monthly_amount,
                'cycle_duration_months' => count($request->member_ids) + 1,
                'creator_id' => $request->user()->id,
                'status' => 'pending',
            ]);

            DaretMember::create([
                'daret_group_id' => $group->id,
                'user_id' => $request->user()->id,
                'turn_order' => 1,
                'status' => 'accepted',
            ]);

            foreach ($request->member_ids as $index => $userId) {
                DaretMember::create([
                    'daret_group_id' => $group->id,
                    'user_id' => $userId,
                    'turn_order' => $index + 2,
                    'status' => 'pending',
                ]);

                event(new DaretInvitationReceived($group, $userId));
            }

            return $group;
        });

        return response()->json([
            'message' => 'Group created. Invitations dispatched.',
            'group' => $group->load(['members.user', 'creator']),
        ], 201);
    }

    public function pay(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();

        if ($member->has_paid_current_round) {
            throw ValidationException::withMessages(['message' => 'You already paid for this round.']);
        }

        if ($group->status !== 'active') {
            throw ValidationException::withMessages(['message' => 'This group is not active yet.']);
        }

        DB::transaction(function () use ($request, $group, $member) {
            $account = $request->user()->accounts()->where('status', 'active')
                ->lockForUpdate()
                ->first();

            if (! $account) {
                throw ValidationException::withMessages(['message' => 'No active account found.']);
            }

            if ((float) $account->balance < (float) $group->monthly_amount) {
                throw ValidationException::withMessages(['message' => 'Not enough balance for this contribution.']);
            }

            $account->decrement('balance', $group->monthly_amount);
            $member->update(['has_paid_current_round' => true]);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => null,
                'amount' => $group->monthly_amount,
                'method' => 'daret_contribution',
                'category' => 'savings',
                'status' => 'completed',
                'type' => 'transfer',
            ]);

            DaretService::checkAndProcessPayout($group);
        });

        return response()->json(['message' => 'Contribution paid successfully!']);
    }

    public function accept(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();
        $managementFee = 10.00;

        DB::transaction(function () use ($request, $member, $group, $managementFee) {
            $account = $request->user()->accounts()->where('status', 'active')
                ->lockForUpdate()
                ->first();

            if (! $account || (float) $account->balance < $managementFee) {
                throw ValidationException::withMessages([
                    'message' => 'Insufficient funds for the 10 MAD group management fee.',
                ]);
            }

            $account->decrement('balance', $managementFee);
            $member->update(['status' => 'accepted']);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'amount' => $managementFee,
                'method' => 'daret_fee',
                'category' => 'Fees',
                'description' => "Group Management Fee for: {$group->name}",
                'status' => 'completed',
                'type' => 'transfer',
            ]);

            if ($group->members()->where('status', '!=', 'accepted')->count() === 0) {
                $group->update(['status' => 'active']);
            }
        });

        return response()->json(['message' => 'Invitation accepted.']);
    }

    public function decline(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();
        $member->update(['status' => 'declined']);

        return response()->json(['message' => 'Invitation declined.']);
    }

    public function users(Request $request)
    {
        return response()->json(
            User::where('id', '!=', $request->user()->id)->get(['id', 'first_name', 'last_name'])
        );
    }
}
