import { searchAll } from "../../api/queries/searchAll";
import type { ClubSummary, MeetingSummary, RouteSuggestion, UserSummary } from "../../api/types/searchTypes";

export interface SearchLoaderResult {
    searchResults: {
        clubs: ClubSummary[];
        users: UserSummary[];
        meetings: MeetingSummary[];
        routes: RouteSuggestion[];
    };
}

export async function searchLoader({
    request,
}: {
    request: Request;
}): Promise<SearchLoaderResult> {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) {
        throw new Error('Search term must be provided');
    }

    const results = await searchAll(term);

    const searchResults = {
        clubs: results.objects.filter(obj => obj.club).map(obj => obj.club!),
        users: results.objects.filter(obj => obj.user).map(obj => obj.user!),
        meetings: results.objects.filter(obj => obj.meeting).map(obj => obj.meeting!),
        routes: results.objects.filter(obj => obj.route).map(obj => obj.route!)
    };

    return { searchResults };
}