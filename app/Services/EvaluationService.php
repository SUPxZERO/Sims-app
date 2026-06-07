<?php

namespace App\Services;

use App\Models\Internship;
use App\Models\CompanyEvaluation;
use App\Models\LecturerGrade;
use App\Models\FinalScore;
use Illuminate\Support\Facades\DB;
use Exception;

class EvaluationService
{
    /**
     * Submit a company evaluation for an internship
     */
    public function submitCompanyEvaluation($user, $internshipId, $data)
    {
        $internship = Internship::findOrFail($internshipId);

        // Verify the user is the company assigned to this internship
        if ($internship->company_user_id !== $user->user_id) {
            throw new Exception("Unauthorized: You are not assigned to this internship.", 403);
        }

        // Verify internship is completed or ready for evaluation
        if ($internship->status !== 'COMPLETED') {
            throw new Exception("Internship must be COMPLETED before evaluation can be submitted.", 400);
        }

        // Check if evaluation already exists
        $evaluation = CompanyEvaluation::where('internship_id', $internshipId)->first();
        
        if ($evaluation && $evaluation->status === 'SUBMITTED') {
            throw new Exception("Evaluation has already been submitted.", 400);
        }

        if (!$evaluation) {
            $evaluation = new CompanyEvaluation();
            $evaluation->internship_id = $internshipId;
            $evaluation->evaluator_user_id = $user->user_id;
        }

        $evaluation->fill([
            'composite_score' => $data['composite_score'],
            'strengths' => $data['strengths'] ?? null,
            'improvements' => $data['improvements'] ?? null,
            'overall_comments' => $data['overall_comments'] ?? null,
            'hiring_recommendation' => $data['hiring_recommendation'] ?? null,
        ]);

        if (isset($data['status']) && $data['status'] === 'SUBMITTED') {
            $evaluation->status = 'SUBMITTED';
            $evaluation->submitted_at = now();
        } else {
            $evaluation->status = 'DRAFT';
        }

        $evaluation->save();

        $this->checkAndTriggerFinalGrading($internshipId);

        return $evaluation;
    }

    /**
     * Submit a lecturer grade for an internship
     */
    public function submitLecturerGrade($user, $internshipId, $data)
    {
        $internship = Internship::findOrFail($internshipId);

        // Verify the user is the lecturer assigned to this internship
        if ($internship->lecturer_user_id !== $user->user_id) {
            throw new Exception("Unauthorized: You are not the lecturer for this internship.", 403);
        }

        // Verify internship is completed
        if ($internship->status !== 'COMPLETED') {
            throw new Exception("Internship must be COMPLETED before grades can be submitted.", 400);
        }

        // Check if grade already exists
        $grade = LecturerGrade::where('internship_id', $internshipId)->first();
        
        if ($grade && $grade->status === 'SUBMITTED') {
            throw new Exception("Lecturer grade has already been submitted.", 400);
        }

        if (!$grade) {
            $grade = new LecturerGrade();
            $grade->internship_id = $internshipId;
            $grade->grader_user_id = $user->user_id;
        }

        $grade->fill([
            'report_quality_score' => $data['report_quality_score'],
            'presentation_score' => $data['presentation_score'],
            'engagement_score' => $data['engagement_score'],
            'overall_comments' => $data['overall_comments'] ?? null,
        ]);

        // Calculate composite score (assuming equal weights or as defined by business logic)
        $grade->composite_score = round(
            ($data['report_quality_score'] + $data['presentation_score'] + $data['engagement_score']) / 3, 2
        );

        if (isset($data['status']) && $data['status'] === 'SUBMITTED') {
            $grade->status = 'SUBMITTED';
            $grade->submitted_at = now();
        } else {
            $grade->status = 'DRAFT';
        }

        $grade->save();

        $this->checkAndTriggerFinalGrading($internshipId);

        return $grade;
    }

    /**
     * Check if both evaluations are submitted, and if so, trigger final grading
     */
    private function checkAndTriggerFinalGrading($internshipId)
    {
        $companyEval = CompanyEvaluation::where('internship_id', $internshipId)
            ->where('status', 'SUBMITTED')
            ->first();
            
        $lecturerGrade = LecturerGrade::where('internship_id', $internshipId)
            ->where('status', 'SUBMITTED')
            ->first();

        if ($companyEval && $lecturerGrade) {
            // Both submitted — call Oracle stored procedure to calculate final score
            DB::statement('BEGIN pkg_grading_engine.calculate_final_score(:internship_id); END;', [
                'internship_id' => $internshipId
            ]);
            // Note: Oracle internship status only supports ACTIVE/COMPLETED/TERMINATED.
            // Final grading completion is indicated by the existence of a final_scores record.
        }
    }

    /**
     * Fetch the final grade for an internship
     */
    public function getFinalGrade($user, $internshipId)
    {
        $internship = Internship::findOrFail($internshipId);

        // Access control: Student, assigned Company, or assigned Lecturer
        if ($internship->student_user_id !== $user->user_id && 
            $internship->company_user_id !== $user->user_id && 
            $internship->lecturer_user_id !== $user->user_id &&
            $user->role !== 'ADMIN') {
            throw new Exception("Unauthorized to view this grade.", 403);
        }

        $finalScore = FinalScore::where('internship_id', $internshipId)->first();
        $companyEval = CompanyEvaluation::where('internship_id', $internshipId)->first();
        $lecturerGrade = LecturerGrade::where('internship_id', $internshipId)->first();

        return [
            'internship' => $internship,
            'company_evaluation' => $companyEval,
            'lecturer_grade' => $lecturerGrade,
            'final_score' => $finalScore
        ];
    }
}
