<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;

class NotificationController extends Controller
{
    // Fetch notifications for the current user
    public function index(Request $request)
    {
        $userId = $request->user()->user_id;
        
        $query = Notification::where('user_id', $userId)->orderBy('created_at', 'desc');
        
        if ($request->has('unread_only') && $request->unread_only == 'true') {
            $query->unread();
        }
        
        $notifications = $query->take(50)->get(); // Limit to recent 50
        
        $unreadCount = Notification::where('user_id', $userId)->unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }

    // Mark a specific notification as read
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->user_id)
            ->where('notification_id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->is_read = true;
        $notification->read_at = now();
        $notification->save();

        return response()->json(['message' => 'Notification marked as read', 'notification' => $notification]);
    }

    // Mark all notifications as read for current user
    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->user_id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    // Send a new notification (Admin only)
    public function store(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required', // Can be specific user_id or 'all'/'role' etc. Here we assume specific user or 'all' mapped to array in frontend.
            'title' => 'required|string|max:150',
            'message' => 'required|string|max:1000',
            'type' => 'required|string|in:SYSTEM,ALERT,INFO',
            'priority' => 'required|string|in:LOW,MEDIUM,HIGH',
        ]);

        try {
            $userIds = [];
            
            if ($request->user_id === 'all') {
                $userIds = User::where('status', 'ACTIVE')->pluck('user_id')->toArray();
            } else if (is_string($request->user_id) && str_starts_with($request->user_id, 'role:')) {
                $role = substr($request->user_id, 5);
                $userIds = User::where('status', 'ACTIVE')->where('role', $role)->pluck('user_id')->toArray();
            } else if (is_array($request->user_id)) {
                $userIds = $request->user_id;
            } else {
                $userIds = [$request->user_id];
            }

            $count = 0;
            foreach ($userIds as $uid) {
                Notification::create([
                    'user_id' => $uid,
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type,
                    'priority' => $request->priority,
                    'channel' => 'IN_APP',
                    'is_read' => 0,
                    'created_at' => now(),
                ]);
                $count++;
            }

            return response()->json(['message' => 'Notifications sent successfully', 'count' => $count], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to send notifications: ' . $e->getMessage()], 500);
        }
    }
}
