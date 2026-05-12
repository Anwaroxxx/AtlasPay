<?php

namespace App\Http\Controllers;

use App\Events\DaretInvitationReceived;
use App\Events\GenericNotification;
use App\Models\DaretGroup;
use App\Models\DaretMember;
use App\Models\Transaction;
use App\Models\User;
use App\Services\DaretService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DaretController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $myGroups = $user->daretGroups()->with(['members.user', 'creator'])->get();
        $allUsers = User::where('id', '!=', $user->id)->get(['id', 'first_name', 'last_name']);

        // Pending invitations for the current user
        $pendingInvitations = DaretMember::where('user_id', $user->id)
            ->where('status', 'pending')
            ->with(['group.creator', 'group.members.user'])
            ->get();

        return Inertia::render('daret/index', [
            'myGroups' => $myGroups,
            'allUsers' => $allUsers,
            'pendingInvitations' => $pendingInvitations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'monthly_amount' => 'required|numeric|min:100',
            'member_ids' => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $group = DaretGroup::create([
                'name' => $request->name,
                'monthly_amount' => $request->monthly_amount,
                'cycle_duration_months' => count($request->member_ids) + 1,
                'creator_id' => $request->user()->id,
                'status' => 'pending',
            ]);

            // Add creator as first member (auto-accepted)
            DaretMember::create([
                'daret_group_id' => $group->id,
                'user_id' => $request->user()->id,
                'turn_order' => 1,
                'status' => 'accepted',
            ]);

            // Add other members as pending invitations
            foreach ($request->member_ids as $index => $userId) {
                DaretMember::create([
                    'daret_group_id' => $group->id,
                    'user_id' => $userId,
                    'turn_order' => $index + 2,
                    'status' => 'pending',
                ]);

                // Dispatch real-time notification event
                event(new DaretInvitationReceived($group, $userId));
            }
        });

        return redirect()->back()->with('message', 'Group created. Invitations have been dispatched to all members.');
    }

    public function accept(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();

        $managementFee = 10.00;
        $account = $request->user()->accounts()->where('status', 'active')->first();

        if (! $account || $account->balance < $managementFee) {
            return redirect()->back()->with('error', 'Insufficient funds for the 10 MAD group management fee.');
        }

        DB::transaction(function () use ($member, $account, $managementFee, $group) {
            $account->decrement('balance', $managementFee);
            $member->update(['status' => 'accepted']);

            // Record management fee
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

            // Check if all members accepted — if so, mark group as ready
            $allAccepted = $group->members()->where('status', '!=', 'accepted')->count() === 0;
            if ($allAccepted) {
                $group->update(['status' => 'active']);
            }
        });

        return redirect()->back()->with('message', 'Invitation accepted. The management fee has been processed.');
    }

    public function decline(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();
        $member->update(['status' => 'declined']);

        return redirect()->back()->with('message', 'Invitation declined.');
    }

    public function destroy(Request $request, DaretGroup $group)
    {
        if ($group->creator_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        if ($group->status === 'active') {
            return redirect()->back()->with('error', 'Active groups cannot be deleted while in progress.');
        }

        DB::transaction(function () use ($group) {
            // Notify all members before deletion
            foreach ($group->members as $member) {
                if ($member->user_id !== $group->creator_id) {
                    event(new GenericNotification(
                        $member->user_id,
                        'Daret Circle Disbanded',
                        "The savings circle '{$group->name}' has been disbanded by its creator.",
                        'warning'
                    ));
                }
            }

            $group->members()->delete();
            $group->delete();
        });

        return redirect()->route('daret.index')->with('message', 'Savings circle has been successfully disbanded.');
    }

    public function pay(Request $request, DaretGroup $group)
    {
        $member = $group->members()->where('user_id', $request->user()->id)->firstOrFail();

        if ($member->has_paid_current_round) {
            return redirect()->back()->with('error', 'You already paid for this round.');
        }

        if ($group->status !== 'active') {
            return redirect()->back()->with('error', 'This group is not active yet.');
        }

        DB::transaction(function () use ($request, $group, $member) {
            $account = $request->user()->accounts()->where('status', 'active')->firstOrFail();

            if ($account->balance < $group->monthly_amount) {
                return redirect()->back()->with('error', 'Not enough balance for this contribution. Please deposit funds and try again.');
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

        return redirect()->back()->with('message', 'Contribution paid successfully!');
    }
}
