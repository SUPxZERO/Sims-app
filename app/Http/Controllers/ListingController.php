<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ListingService;
use Exception;

class ListingController extends Controller
{
    protected $listingService;

    public function __construct(ListingService $listingService)
    {
        $this->listingService = $listingService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'location' => 'required|string|max:100',
            'work_mode' => 'required|in:ONSITE,REMOTE,HYBRID',
            'duration_weeks' => 'required|integer|min:1',
            'quota' => 'required|integer|min:1',
            'application_deadline' => 'required|date',
            'skills' => 'sometimes|array',
            'skills.*.skill_id' => 'required|integer',
            'skills.*.importance' => 'required|in:MANDATORY,HIGH,MEDIUM,LOW',
            'skills.*.importance_weight' => 'sometimes|numeric'
        ]);

        try {
            $companyUserId = auth()->user()->user_id;
            
            // Only company users can create listings
            if (auth()->user()->role !== 'COMPANY') {
                return response()->json(['error' => 'Only companies can create listings.'], 403);
            }

            $listing = $this->listingService->createListing($request->all(), $companyUserId);
            return response()->json(['message' => 'Listing created successfully', 'listing' => $listing], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function review(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:PUBLISHED,REJECTED',
            'feedback' => 'nullable|string'
        ]);

        try {
            $adminId = auth()->user()->user_id;

            if (auth()->user()->role !== 'ADMIN') {
                return response()->json(['error' => 'Only admins can review listings.'], 403);
            }

            $listing = $this->listingService->reviewListing($id, $adminId, $request->status, $request->feedback);
            return response()->json(['message' => 'Listing reviewed successfully', 'listing' => $listing]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['status', 'company_user_id']);
            $user = auth()->user();
            
            if ($user->role === 'STUDENT') {
                $filters['status'] = 'PUBLISHED';
            }

            $listings = $this->listingService->getListings($filters);

            if ($user->role === 'STUDENT') {
                $scores = \App\Models\RecommendationScore::where('user_id', $user->user_id)
                    ->get()
                    ->keyBy('listing_id');
                
                $listings->each(function($listing) use ($scores) {
                    if ($scores->has($listing->listing_id)) {
                        $listing->match_details = $scores->get($listing->listing_id);
                        $listing->match_score = $listing->match_details->composite_score;
                    } else {
                        $listing->match_details = null;
                        $listing->match_score = null;
                    }
                });
            }

            return response()->json(['listings' => $listings]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
