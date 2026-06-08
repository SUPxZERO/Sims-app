<?php

namespace App\Http\Controllers;

use App\Models\EvaluationCriteria;
use Illuminate\Http\Request;
use Exception;

class EvaluationCriteriaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $criteria = EvaluationCriteria::orderBy('sort_order')->get();
            return response()->json(['criteria' => $criteria], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch evaluation criteria.'], 500);
        }
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'criteria_name' => 'required|string|max:100|unique:evaluation_criteria,criteria_name',
            'description' => 'nullable|string|max:500',
            'weight' => 'required|numeric|min:0|max:1',
            'sort_order' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        try {
            $criteria = EvaluationCriteria::create($request->all());
            return response()->json(['message' => 'Evaluation criteria created successfully', 'criteria' => $criteria], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create evaluation criteria.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'criteria_name' => 'required|string|max:100|unique:evaluation_criteria,criteria_name,' . $id . ',criteria_id',
            'description' => 'nullable|string|max:500',
            'weight' => 'required|numeric|min:0|max:1',
            'sort_order' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        try {
            $criteria = EvaluationCriteria::findOrFail($id);
            $criteria->update($request->all());
            return response()->json(['message' => 'Evaluation criteria updated successfully', 'criteria' => $criteria], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update evaluation criteria.'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $criteria = EvaluationCriteria::findOrFail($id);
            $criteria->delete();
            return response()->json(['message' => 'Evaluation criteria deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete evaluation criteria.'], 500);
        }
    }
}
