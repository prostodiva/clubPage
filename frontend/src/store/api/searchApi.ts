import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SearchResponse } from "./types/searchTypes";

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/search',
    }),
    tagTypes: ['Search', 'Users', 'Clubs', 'Meetings', 'Routes', 'SearchResults'] as const,
    endpoints(builder) {
        return {
            searchAll: builder.query<SearchResponse, string>({
                query: (term) => `?term=${term}`,
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

export const { useSearchAllQuery } = searchApi;


