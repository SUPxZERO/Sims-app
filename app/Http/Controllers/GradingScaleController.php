<?php

namespace App\Http\Controllers;

use App\Models\GradingScale;
use Illuminate\Http\Request;
use Exception;

class GradingScaleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $scales = GradingScale::orderBy('sort_order')->get();
            return response()->json(['scales' => $scales], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch grading scales.'], 500);
        }
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'letter_grade' => 'required|string|max:5|unique:grading_scales,letter_grade',
            'min_score' => 'required|numeric|min:0|max:100',
            'max_score' => 'required|numeric|min:0|max:100|gte:min_score',
            'grade_point' => 'nullable|numeric',
            'sort_order' => 'required|integer',
        ]);

        try {
            $scale = GradingScale::create($request->all());
            return response()->json(['message' => 'Grading scale created successfully', 'scale' => $scale], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create grading scale.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'letter_grade' => 'required|string|max:5|unique:grading_scales,letter_grade,' . $id . ',grade_scale_id',
            'min_score' => 'required|numeric|min:0|max:100',
            'max_score' => 'required|numeric|min:0|max:100|gte:min_score',
            'grade_point' => 'nullable|numeric',
            'sort_order' => 'required|integer',
        ]);

        try {
            $scale = GradingScale::findOrFail($id);
            $scale->update($request->all());
            return response()->json(['message' => 'Grading scale updated successfully', 'scale' => $scale], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update grading scale.'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $scale = GradingScale::findOrFail($id);
            $scale->delete();
            return response()->json(['message' => 'Grading scale deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete grading scale.'], 500);
        }
    }
}
