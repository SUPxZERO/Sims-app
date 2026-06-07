<?php

namespace App\Http\Controllers;

use App\Services\InternshipService;
use Illuminate\Http\Request;
use Exception;

class InternshipController extends Controller
{
    protected $internshipService;

    public function __construct(InternshipService $internshipService)
    {
        $this->internshipService = $internshipService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $internships = $this->internshipService->getInternships($user);

        return response()->json([
            'internships' => $internships
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        try {
            $internship = $this->internshipService->getInternshipById($user, $id);
            return response()->json([
                'internship' => $internship
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json([
                'error' => $e->getMessage()
            ], $code);
        }
    }
}
