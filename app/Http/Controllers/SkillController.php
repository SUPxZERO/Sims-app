<?php

namespace App\Http\Controllers;

use App\Models\SkillCategory;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $categories = SkillCategory::with(['skills' => function ($query) {
            $query->where('is_active', true)->orderBy('skill_name');
        }])->where('is_active', true)->orderBy('sort_order')->get();

        return response()->json($categories);
    }
}
