/**
 * @fileOverview Search API queries for the application
 * @description Provides functions to search across all entities(clubs, users, meetings) using the backend API
 * @module api/queries/searchAll
 * @author Margarita Kattsyna
 * @version 1.0.0
 * */

import type { SearchResponse } from "../types/searchTypes";

/**
 * Search all entities based on a search term
 * @description Performs a search across clubs, users, and meeting using the backend search API endpoint
 * @param {string} term - The search term for ("users","meetings", "clubs")
 * @returns {Promise<SearchResponse>} Promise containing search results with objects arrau
 * @throws {Error} when the search request fails or returns non-OK status
 * @example
 * ```typescript
 * //search for users
 * const results = await searchAll('admin')
 * console.log(results.objects);
 * ```
 * @see {@link SearchResponse} - The response type structure
 * @see {@link searchLoader} - The loader that uses this function
 * @fires fetch - makes HTTP request to /search endpoint
 * */
export async function searchAll(term: string): Promise<SearchResponse> {
    const res = await fetch(`/search?term=${term}`);

    if (!res.ok) {
        throw new Error('Failed to search');
    }

    const data: SearchResponse = await res.json();
    return data;
}