import { searchApi } from '../../store/api/searchApi';
import type { SearchLoaderResult } from '../../store/api/types/searchTypes';
import { store } from '../../store/store';

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

    const result = await store.dispatch(
        searchApi.endpoints.searchAll.initiate(term)
    );

    if (result.error) {
        throw new Error('Search failed');
    }

    const { objects } = result.data!;

    const searchResults = {
        clubs: objects.filter(obj => obj.club).map(obj => obj.club!),
        users: objects.filter(obj => obj.user).map(obj => obj.user!),
        meetings: objects.filter(obj => obj.meeting).map(obj => obj.meeting!),
        routes: objects.filter(obj => obj.route).map(obj => obj.route!)
    };

    return { searchResults };
}