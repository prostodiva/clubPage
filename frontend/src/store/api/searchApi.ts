/**
 * @fileoverview RTK Query API slice for search functionality
 * @description Defines the search API endpoints with caching, tagging, and automatic state management
 * @module store/api/searchApi
 * @author Margarita Kattsyna
 * @version 1.0.0
 * @since 1.0.0
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SearchResponse } from "./types/searchTypes";

/**
 * RTK Query API slice for search operations
 * @description Creates a search API with automatic caching, invalidation, and state management
 * @type {import('@reduxjs/toolkit/query').Api}
 * @see {@link SearchResponse} - Type definition for search API responses
 * @see {@link fetchBaseQuery} - Base query configuration for HTTP requests
 */
export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/search',
    }),
    tagTypes: ['Search', 'Users', 'Clubs', 'Meetings', 'Routes', 'SearchResults'] as const,
    endpoints(builder) {
        return {
            /**
             * Search endpoint for finding clubs, users, meetings, and routes
             * @description Performs a comprehensive search across all entity types with intelligent caching
             * @param {string} term - The search term to look for
             * @returns {Promise<SearchResponse>} Promise containing search results
             * @see {@link SearchResponse} - Response type structure
             */
            searchAll: builder.query<SearchResponse, string>({
                query: (term) => `?term=${term}`,
                /**
                 * Provides tags for cache management and invalidation
                 * @description Creates cache tags for the search term and individual entities for granular cache control
                 * @param {SearchResponse | undefined} result - The search results
                 * @param {FetchBaseQueryError | undefined} _error - Any error that occurred (unused)
                 * @param {string} term - The search term used
                 * @returns {Array<{type: string, id: string}>} Array of cache tags
                 */
                providesTags: (result, _error, term) => {
                    if (!result) return [{ type: 'Search' as const, id: term }];

                    const tags: Array<{ type: 'Search' | 'Users' | 'Clubs' | 'Meetings' | 'Routes' | 'SearchResults'; id: string }> = [];

                    // Tag the search term itself
                    tags.push({ type: 'Search' as const, id: term });

                    // Tag individual items for granular cache invalidation
                    result.objects.forEach(obj => {
                        if (obj.club) {
                            tags.push({ type: 'Clubs' as const, id: obj.club._id });
                        }
                        if (obj.user) {
                            tags.push({ type: 'Users' as const, id: obj.user._id });
                        }
                        if (obj.meeting) {
                            tags.push({ type: 'Meetings' as const, id: obj.meeting._id });
                        }
                        if (obj.route) {
                            tags.push({ type: 'Routes' as const, id: obj.route.category });
                        }
                    });
                    
                    tags.push({ type: 'SearchResults' as const, id: term });
                    return tags;
                }
            }),
        }
    }
});
/**
 * Exported hooks for use in React components
 * @description Provides typed hooks for interacting with the search API
 * @see {@link useSearchAllQuery} - Hook for performing search queries
 */
export const { useSearchAllQuery } = searchApi;


