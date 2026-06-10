<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SavedListing;
use Illuminate\Support\Facades\Auth;

class SavedListingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $savedListings = SavedListing::with(['listing.company', 'listing.companyProfile', 'listing.listingRequiredSkills.skill'])
            ->where('student_id', $user->user_id)
            ->get();

        return response()->json(['saved_listings' => $savedListings]);
    }

    public function store($listingId)
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $saved = SavedListing::firstOrCreate([
            'student_id' => $user->user_id,
            'listing_id' => $listingId
        ]);

        return response()->json([
            'message' => 'Listing saved successfully',
            'saved_listing' => $saved
        ]);
    }

    public function destroy($listingId)
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        SavedListing::where('student_id', $user->user_id)
            ->where('listing_id', $listingId)
            ->delete();

        return response()->json(['message' => 'Listing unsaved successfully']);
    }
}
