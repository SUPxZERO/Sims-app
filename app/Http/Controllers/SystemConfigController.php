<?php

namespace App\Http\Controllers;

use App\Models\SystemConfig;
use Illuminate\Http\Request;
use Exception;

class SystemConfigController extends Controller
{
    public function index(Request $request)
    {
        // Only allow admins
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $configs = SystemConfig::with('updater:user_id,full_name')->orderBy('config_id')->get();
            return response()->json(['configs' => $configs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch configurations.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'config_value' => 'required|string|max:500',
        ]);

        try {
            $config = SystemConfig::findOrFail($id);
            $config->config_value = $request->config_value;
            $config->updated_by = $request->user()->user_id;
            $config->updated_at = now();
            $config->save();

            return response()->json(['message' => 'Configuration updated successfully', 'config' => $config], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update configuration.'], 500);
        }
    }
}
