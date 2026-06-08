<?php

namespace App\Http\Controllers;

use App\Models\SkillCategory;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        // Admin can fetch all, others fetch active only
        if ($request->user() && $request->user()->role === 'ADMIN') {
            $categories = SkillCategory::with('skills')->orderBy('sort_order')->get();
            return response()->json($categories);
        }

        $categories = SkillCategory::with(['skills' => function ($query) {
            $query->where('is_active', true)->orderBy('skill_name');
        }])->where('is_active', true)->orderBy('sort_order')->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'skill_category_id' => 'required|exists:skill_categories,skill_category_id',
            'skill_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        try {
            $skill = \App\Models\Skill::create($request->all());
            return response()->json(['message' => 'Skill created successfully', 'skill' => $skill], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create skill.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'skill_category_id' => 'required|exists:skill_categories,skill_category_id',
            'skill_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        try {
            $skill = \App\Models\Skill::findOrFail($id);
            $skill->update($request->all());
            return response()->json(['message' => 'Skill updated successfully', 'skill' => $skill], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update skill.'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $skill = \App\Models\Skill::findOrFail($id);
            $skill->delete();
            return response()->json(['message' => 'Skill deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete skill.'], 500);
        }
    }
}
