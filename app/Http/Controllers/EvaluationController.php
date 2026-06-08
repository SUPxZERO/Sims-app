<?php

namespace App\Http\Controllers;

use App\Services\EvaluationService;
use Illuminate\Http\Request;
use Exception;

class EvaluationController extends Controller
{
    protected $evaluationService;

    public function __construct(EvaluationService $evaluationService)
    {
        $this->evaluationService = $evaluationService;
    }

    public function getCriteria(Request $request)
    {
        try {
            $criteria = \App\Models\EvaluationCriteria::where('is_active', 1)->orderBy('sort_order')->get();
            return response()->json([
                'criteria' => $criteria
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function submitCompanyEvaluation(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'composite_score' => 'required|numeric|min:0|max:100',
            'strengths' => 'nullable|string',
            'improvements' => 'nullable|string',
            'overall_comments' => 'nullable|string',
            'hiring_recommendation' => 'nullable|in:WOULD_HIRE,WOULD_CONSIDER,WOULD_NOT_HIRE',
            'status' => 'required|in:DRAFT,SUBMITTED',
            'criteria_scores' => 'nullable|array',
            'criteria_scores.*.criteria_id' => 'required_with:criteria_scores|integer|exists:evaluation_criteria,criteria_id',
            'criteria_scores.*.score' => 'required_with:criteria_scores|numeric|min:0|max:10'
        ]);

        try {
            $evaluation = $this->evaluationService->submitCompanyEvaluation($user, $id, $request->all());
            return response()->json([
                'message' => 'Company evaluation saved successfully',
                'evaluation' => $evaluation
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function submitLecturerGrade(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'report_quality_score' => 'required|numeric|min:0|max:100',
            'presentation_score' => 'required|numeric|min:0|max:100',
            'engagement_score' => 'required|numeric|min:0|max:100',
            'overall_comments' => 'nullable|string',
            'status' => 'required|in:DRAFT,SUBMITTED'
        ]);

        try {
            $grade = $this->evaluationService->submitLecturerGrade($user, $id, $request->all());
            return response()->json([
                'message' => 'Lecturer grade saved successfully',
                'grade' => $grade
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function getGrade(Request $request, $id)
    {
        $user = $request->user();

        try {
            $data = $this->evaluationService->getFinalGrade($user, $id);
            return response()->json($data, 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }
}
