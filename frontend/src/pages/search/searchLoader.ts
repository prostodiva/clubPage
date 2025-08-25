/**
 * Search page loader for React Router
 * Handles data loading for search results page with data processing and filtering
 * @module pages/search/searchLoader
 * @author Margarita Kattsyna
 */

import { searchApi } from '../../store/api/searchApi';
import type { SearchLoaderResult } from '../../store/api/types/searchTypes';
import { store } from '../../store/store';

/**
 * Loader function for search page that fetches and processes search results
 * Fetches search results from API using RTK Query and processes them into organized categories for display
 * @param params - Loader parameters
 * @param params.request - The incoming request object containing URL parameters
 * @returns Promise containing processed search results organized by type
 * @throws {Error} When search term is missing from URL parameters
 * @throws {Error} When search API request fails
 * @see {@link searchApi} - RTK Query API for search functionality
 * @see {@link SearchLoaderResult} - Type definition for loader results
 */
export async function searchLoader({
  request,
}: {
  request: Request;
}): Promise<SearchLoaderResult> {
  // Extract search term from URL query parameters
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  // Validate that search term is provided
  if (!term) {
    throw new Error('Search term must be provided');
  }

  // Use RTK Query to fetch search results
  const result = await store.dispatch(
    searchApi.endpoints.searchAll.initiate(term)
  );

  // Handle API errors
  if (result.error) {
    throw new Error('Search failed');
  }

  // Extract objects from the response
  const { objects } = result.data!;

  // Process and organize search results by entity type
  const searchResults = {
    clubs: objects.filter((obj) => obj.club).map((obj) => obj.club!),
    users: objects.filter((obj) => obj.user).map((obj) => obj.user!),
    meetings: objects.filter((obj) => obj.meeting).map((obj) => obj.meeting!),
    routes: objects.filter((obj) => obj.route).map((obj) => obj.route!),
  };

  return { searchResults };
}

// Export the type for use in other files
export type { SearchLoaderResult } from '../../store/api/types/searchTypes';
