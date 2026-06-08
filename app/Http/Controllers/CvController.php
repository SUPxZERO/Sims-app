<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CvService;
use Illuminate\Support\Facades\Validator;

class CvController extends Controller
{
    protected $cvService;

    public function __construct(CvService $cvService)
    {
        $this->cvService = $cvService;
    }

    /**
     * Helper to verify if authenticated user is a student
     */
    private function authorizeStudent(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'STUDENT') {
            abort(response()->json(['message' => 'Unauthorized. Only students can manage CVs.'], 403));
        }
        return $user;
    }

    /**
     * Get the authenticated user's CV details
     */
    public function show(Request $request)
    {
        $user = $this->authorizeStudent($request);
        $cv = $this->cvService->getOrCreateCvForUser($user->user_id);
        $cv->load(['educations', 'experiences', 'skills', 'documents', 'versions']);
        
        return response()->json($cv, 200);
    }

    /**
     * Update CV personal summary
     */
    public function updatePersonalSummary(Request $request)
    {
        $user = $this->authorizeStudent($request);
        
        $validator = Validator::make($request->all(), [
            'personal_summary' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cv = $this->cvService->updatePersonalSummary($user->user_id, $request->input('personal_summary'));
        $cv->load(['educations', 'experiences', 'skills', 'documents', 'versions']);

        return response()->json($cv, 200);
    }

    /**
     * Update CV visibility status
     */
    public function updateVisibility(Request $request)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'visibility' => 'required|in:PUBLIC,PRIVATE',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cv = $this->cvService->updateVisibility($user->user_id, $request->input('visibility'));
        $cv->load(['educations', 'experiences', 'skills', 'documents', 'versions']);

        return response()->json($cv, 200);
    }

    /**
     * Add an education history entry
     */
    public function addEducation(Request $request)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'institution_name' => 'required|string|max:150',
            'degree' => 'required|string|max:100',
            'field_of_study' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'gpa' => 'nullable|numeric|between:0,4.00',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $education = $this->cvService->addEducation($user->user_id, $request->all());

        return response()->json($education, 201);
    }

    /**
     * Update an existing education entry
     */
    public function updateEducation(Request $request, $id)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'institution_name' => 'sometimes|required|string|max:150',
            'degree' => 'sometimes|required|string|max:100',
            'field_of_study' => 'sometimes|required|string|max:100',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'gpa' => 'nullable|numeric|between:0,4.00',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $education = $this->cvService->updateEducation($user->user_id, (int)$id, $request->all());

        return response()->json($education, 200);
    }

    /**
     * Delete an education entry
     */
    public function deleteEducation(Request $request, $id)
    {
        $user = $this->authorizeStudent($request);
        $this->cvService->deleteEducation($user->user_id, (int)$id);

        return response()->json(['message' => 'Education entry deleted successfully.'], 200);
    }

    /**
     * Add a professional experience entry
     */
    public function addExperience(Request $request)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:150',
            'position_title' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $experience = $this->cvService->addExperience($user->user_id, $request->all());

        return response()->json($experience, 201);
    }

    /**
     * Update an experience entry
     */
    public function updateExperience(Request $request, $id)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'company_name' => 'sometimes|required|string|max:150',
            'position_title' => 'sometimes|required|string|max:100',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $experience = $this->cvService->updateExperience($user->user_id, (int)$id, $request->all());

        return response()->json($experience, 200);
    }

    /**
     * Delete an experience entry
     */
    public function deleteExperience(Request $request, $id)
    {
        $user = $this->authorizeStudent($request);
        $this->cvService->deleteExperience($user->user_id, (int)$id);

        return response()->json(['message' => 'Experience entry deleted successfully.'], 200);
    }

    /**
     * Sync CV skills list
     */
    public function syncSkills(Request $request)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'skills' => 'required|array',
            'skills.*.name' => 'required|string',
            'skills.*.proficiency_level' => 'required|string|in:BEGINNER,INTERMEDIATE,ADVANCED',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $this->cvService->syncSkills($user->user_id, $request->input('skills'));

        return response()->json(['message' => 'CV skills synchronized successfully.'], 200);
    }

    /**
     * Upload and attach a CV document
     */
    public function addDocument(Request $request)
    {
        $user = $this->authorizeStudent($request);

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:10240',
            'document_label' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = $this->cvService->addDocument(
            $user->user_id, 
            $request->file('file'), 
            $request->input('document_label')
        );

        return response()->json($document, 201);
    }

    /**
     * Delete a CV document
     */
    public function deleteDocument(Request $request, $id)
    {
        $user = $this->authorizeStudent($request);
        $this->cvService->deleteDocument($user->user_id, (int)$id);

        return response()->json(['message' => 'Document deleted successfully.'], 200);
    }

    /**
     * Download a CV document
     */
    public function downloadDocument(Request $request, $id)
    {
        $document = \App\Models\CvDocument::with('cv')->findOrFail($id);
        $user = $request->user();

        // Basic authorization: allow owner, company, or admin
        $isOwner = $document->cv->user_id === $user->user_id;
        $isCompany = $user->role === 'COMPANY';
        $isAdmin = $user->role === 'ADMIN';

        if (!$isOwner && !$isCompany && !$isAdmin) {
            abort(response()->json(['message' => 'Unauthorized to download this document.'], 403));
        }

        if (!\Illuminate\Support\Facades\Storage::disk('local')->exists($document->file_path)) {
            abort(response()->json(['message' => 'File not found.'], 404));
        }

        return \Illuminate\Support\Facades\Storage::disk('local')->download(
            $document->file_path, 
            $document->file_name,
            ['Content-Type' => $document->mime_type]
        );
    }

    /**
     * Get talent pool (for companies)
     */
    public function talentPool(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'COMPANY') {
            abort(response()->json(['message' => 'Unauthorized. Only companies can access the talent pool.'], 403));
        }

        $query = \App\Models\Cv::with(['user.studentProfile', 'skills', 'educations', 'experiences'])
            ->where('visibility', 'PUBLIC')
            ->where('status', 'COMPLETE');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('full_name', 'like', "%{$search}%");
                })->orWhereHas('skills', function ($sq) use ($search) {
                    $sq->where('skill_name', 'like', "%{$search}%");
                });
            });
        }

        $cvs = $query->paginate(20);

        return response()->json($cvs, 200);
    }

    /**
     * Get a specific student's CV
     */
    public function getStudentCv(Request $request, $id)
    {
        $user = $request->user();
        
        if (!in_array($user->role, ['COMPANY', 'LECTURER', 'ADMIN'])) {
            abort(response()->json(['message' => 'Unauthorized to view student CV.'], 403));
        }

        $cv = \App\Models\Cv::with(['user.studentProfile', 'educations', 'experiences', 'skills', 'documents', 'versions'])
            ->where('user_id', $id)
            ->firstOrFail();

        return response()->json($cv, 200);
    }
}
