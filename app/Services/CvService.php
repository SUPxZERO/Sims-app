<?php

namespace App\Services;

use App\Models\Cv;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvSkill;
use App\Models\CvDocument;
use App\Models\CvVersion;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CvService
{
    /**
     * Get or create a CV for a student
     */
    public function getOrCreateCvForUser(int $userId): Cv
    {
        $cv = Cv::where('user_id', $userId)->first();

        if (!$cv) {
            $cv = Cv::create([
                'user_id' => $userId,
                'personal_summary' => '',
                'status' => 'INCOMPLETE',
                'visibility' => 'PRIVATE',
                'current_version' => 1,
            ]);

            $this->createVersionSnapshot($cv);
        }

        return $cv;
    }

    /**
     * Update CV personal summary
     */
    public function updatePersonalSummary(int $userId, string $personalSummary): Cv
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $cv->update(['personal_summary' => $personalSummary]);
        $this->createVersionSnapshot($cv);
        return $cv;
    }

    /**
     * Update CV visibility
     */
    public function updateVisibility(int $userId, string $visibility): Cv
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $cv->update(['visibility' => $visibility]);
        $this->createVersionSnapshot($cv);
        return $cv;
    }

    /**
     * Add education entry
     */
    public function addEducation(int $userId, array $data): CvEducation
    {
        $cv = $this->getOrCreateCvForUser($userId);
        
        $education = $cv->educations()->create([
            'institution_name' => $data['institution_name'],
            'degree' => $data['degree'],
            'field_of_study' => $data['field_of_study'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'gpa' => $data['gpa'] ?? null,
            'description' => $data['description'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        $this->createVersionSnapshot($cv);
        return $education;
    }

    /**
     * Update education entry
     */
    public function updateEducation(int $userId, int $educationId, array $data): CvEducation
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $education = CvEducation::where('cv_id', $cv->cv_id)
            ->where('cv_education_id', $educationId)
            ->firstOrFail();

        $education->update([
            'institution_name' => $data['institution_name'] ?? $education->institution_name,
            'degree' => $data['degree'] ?? $education->degree,
            'field_of_study' => $data['field_of_study'] ?? $education->field_of_study,
            'start_date' => $data['start_date'] ?? $education->start_date,
            'end_date' => $data['end_date'] ?? $education->end_date,
            'gpa' => $data['gpa'] ?? $education->gpa,
            'description' => $data['description'] ?? $education->description,
            'sort_order' => $data['sort_order'] ?? $education->sort_order,
        ]);

        $this->createVersionSnapshot($cv);
        return $education;
    }

    /**
     * Delete education entry
     */
    public function deleteEducation(int $userId, int $educationId): void
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $education = CvEducation::where('cv_id', $cv->cv_id)
            ->where('cv_education_id', $educationId)
            ->firstOrFail();

        $education->delete();
        $this->createVersionSnapshot($cv);
    }

    /**
     * Add experience entry
     */
    public function addExperience(int $userId, array $data): CvExperience
    {
        $cv = $this->getOrCreateCvForUser($userId);

        $experience = $cv->experiences()->create([
            'company_name' => $data['company_name'],
            'position_title' => $data['position_title'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'description' => $data['description'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        $this->createVersionSnapshot($cv);
        return $experience;
    }

    /**
     * Update experience entry
     */
    public function updateExperience(int $userId, int $experienceId, array $data): CvExperience
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $experience = CvExperience::where('cv_id', $cv->cv_id)
            ->where('cv_experience_id', $experienceId)
            ->firstOrFail();

        $experience->update([
            'company_name' => $data['company_name'] ?? $experience->company_name,
            'position_title' => $data['position_title'] ?? $experience->position_title,
            'start_date' => $data['start_date'] ?? $experience->start_date,
            'end_date' => $data['end_date'] ?? $experience->end_date,
            'description' => $data['description'] ?? $experience->description,
            'sort_order' => $data['sort_order'] ?? $experience->sort_order,
        ]);

        $this->createVersionSnapshot($cv);
        return $experience;
    }

    /**
     * Delete experience entry
     */
    public function deleteExperience(int $userId, int $experienceId): void
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $experience = CvExperience::where('cv_id', $cv->cv_id)
            ->where('cv_experience_id', $experienceId)
            ->firstOrFail();

        $experience->delete();
        $this->createVersionSnapshot($cv);
    }

    /**
     * Sync CV skills
     */
    public function syncSkills(int $userId, array $skills): void
    {
        $cv = $this->getOrCreateCvForUser($userId);
        
        $syncData = [];
        foreach ($skills as $item) {
            $skillModel = \App\Models\Skill::where('skill_name', $item['name'])->first();
            if (!$skillModel) {
                $category = \App\Models\SkillCategory::firstOrCreate(
                    ['category_name' => 'General'],
                    ['description' => 'General Skills']
                );
                $skillModel = \App\Models\Skill::create([
                    'skill_name' => $item['name'],
                    'skill_category_id' => $category->skill_category_id,
                    'is_active' => true
                ]);
            }
            $skillId = $skillModel->skill_id;

            $level = strtoupper($item['proficiency_level']);
            $weight = match ($level) {
                'BEGINNER' => 0.33,
                'INTERMEDIATE' => 0.66,
                'ADVANCED' => 1.00,
                default => 0.33
            };
            $syncData[$skillId] = [
                'proficiency_level' => $level,
                'proficiency_weight' => $weight,
            ];
        }

        $cv->skills()->sync($syncData);

        if (count($syncData) >= 3) {
            $cv->status = 'COMPLETE';
        } else {
            $cv->status = 'INCOMPLETE';
        }
        $cv->save();

        $this->createVersionSnapshot($cv);
    }

    /**
     * Add CV document attachment
     */
    public function addDocument(int $userId, UploadedFile $file, string $label): CvDocument
    {
        $cv = $this->getOrCreateCvForUser($userId);

        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('cv_documents', $fileName, 'local');

        $document = $cv->documents()->create([
            'document_label' => $label,
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_size_bytes' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        $this->createVersionSnapshot($cv);
        return $document;
    }

    /**
     * Delete CV document attachment
     */
    public function deleteDocument(int $userId, int $documentId): void
    {
        $cv = $this->getOrCreateCvForUser($userId);
        $document = CvDocument::where('cv_id', $cv->cv_id)
            ->where('cv_document_id', $documentId)
            ->firstOrFail();

        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        $this->createVersionSnapshot($cv);
    }

    /**
     * Create automatic version snapshot in cv_versions
     */
    public function createVersionSnapshot(Cv $cv): CvVersion
    {
        $nextVersion = ($cv->versions()->max('version_number') ?? 0) + 1;

        // Force reload relations to get latest changes
        $cv->load(['educations', 'experiences', 'skills', 'documents']);

        $snapshot = [
            'personal_summary' => $cv->personal_summary,
            'status' => $cv->status,
            'visibility' => $cv->visibility,
            'educations' => $cv->educations->toArray(),
            'experiences' => $cv->experiences->toArray(),
            'skills' => $cv->skills->map(function ($skill) {
                return [
                    'skill_id' => $skill->skill_id,
                    'name' => $skill->skill_name,
                    'proficiency_level' => $skill->pivot->proficiency_level,
                    'proficiency_weight' => $skill->pivot->proficiency_weight,
                ];
            })->toArray(),
            'documents' => $cv->documents->toArray(),
        ];

        $version = CvVersion::create([
            'cv_id' => $cv->cv_id,
            'version_number' => $nextVersion,
            'snapshot_data' => $snapshot,
        ]);

        $cv->update(['current_version' => $nextVersion]);

        return $version;
    }
}
