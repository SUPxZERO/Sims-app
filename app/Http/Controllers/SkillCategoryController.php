<?php

namespace App\Http\Controllers;

use App\Models\SkillCategory;
use Illuminate\Http\Request;
use Exception;

class SkillCategoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $categories = SkillCategory::orderBy('sort_order')->get();
            return response()->json(['categories' => $categories], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch skill categories.'], 500);
        }
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'category_name' => 'required|string|max:100|unique:skill_categories,category_name',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'required|integer',
        ]);

        try {
            $category = SkillCategory::create($request->all());
            return response()->json(['message' => 'Skill category created successfully', 'category' => $category], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create skill category.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'category_name' => 'required|string|max:100|unique:skill_categories,category_name,' . $id . ',skill_category_id',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'required|integer',
        ]);

        try {
            $category = SkillCategory::findOrFail($id);
            $category->update($request->all());
            return response()->json(['message' => 'Skill category updated successfully', 'category' => $category], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update skill category.'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $category = SkillCategory::findOrFail($id);
            $category->delete();
            return response()->json(['message' => 'Skill category deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete skill category.'], 500);
        }
    }
}
