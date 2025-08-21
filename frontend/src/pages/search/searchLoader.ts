/**
 * @fileoverview Search page loader for React Router
 * @description Handles data loading for search results page with data processing and filtering
 * @module pages/search/searchLoader
 * @author Margarita Kattsyna
 * @version 1.0.0
 * @since 1.0.0
 */
import { searchApi } from '../../store/api/searchApi';
import type { SearchLoaderResult } from '../../store/api/types/searchTypes';
import { store } from '../../store/store';

/**
 * Loader function for search page that fetches and processes search results
 * @description Fetches search results from API using RTK Query and processes them into organized categories for display
 * @param {Object} params - Loader parameters
 * @param {Request} params.request - The incoming request object containing URL parameters
 * @returns {Promise<SearchLoaderResult>} Promise containing processed search results organized by type
 * @throws {Error} When search term is missing from URL parameters
 * @throws {Error} When search API request fails
 * @example
 * ```typescript
 * // This function is called automatically by React Router
 * // when navigating to /search?term=users
 * const loader = await searchLoader({ request });
 * return loader.searchResults;
 * ```
 * @since 1.0.0
 * @see {@link searchApi} - RTK Query API for search functionality
 * @see {@link SearchPage} - The component that consumes this loader data
 * @see {@link SearchLoaderResult} - Type definition for loader results
 * @fires fetch - Makes API request to search endpoint via RTK Query
 * @fires processing - Processes and filters search results by entity type
 */
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