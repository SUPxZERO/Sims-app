<?php

namespace App\Http\Controllers;

use App\Models\MatchingWeightConfig;
use Illuminate\Http\Request;
use Exception;

class MatchingWeightConfigController extends Controller
{
    public function show()
    {
        try {
            // There's only one row with config_id = 1
            $config = MatchingWeightConfig::firstOrCreate(
                ['config_id' => 1],
                [
                    'skill_weight' => 0.60,
                    'gpa_weight' => 0.20,
                    'preference_weight' => 0.20,
                    'min_score_threshold' => 30.00,
                    'max_recommendations' => 10,
                ]
            );
            return response()->json(['config' => $config], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch matching weight config.'], 500);
        }
    }

    public function update(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'skill_weight' => 'required|numeric|min:0|max:1',
            'gpa_weight' => 'required|numeric|min:0|max:1',
            'preference_weight' => 'required|numeric|min:0|max:1',
            'min_score_threshold' => 'required|numeric|min:0|max:100',
            'max_recommendations' => 'required|integer|min:1|max:50',
        ]);

        $sum = $request->skill_weight + $request->gpa_weight + $request->preference_weight;
        // Float comparison check
        if (abs($sum - 1.0) > 0.0001) {
            return response()->json(['error' => 'The sum of weights must equal 1.00'], 400);
        }

        try {
            $config = MatchingWeightConfig::first();
            if (!$config) {
                $config = new MatchingWeightConfig();
                $config->config_id = 1;
            }
            $config->fill($request->all());
            $config->updated_by = $request->user()->user_id;
            $config->updated_at = now();
            $config->save();

            return response()->json(['message' => 'Matching config updated successfully', 'config' => $config], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update matching config.'], 500);
        }
    }
}
