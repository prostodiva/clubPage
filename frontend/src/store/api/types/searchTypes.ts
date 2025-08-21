/**
 * @fileoverview TypeScript type definitions for search functionality
 * @description Defines interfaces for search responses, entity summaries, and loader results
 * @module store/api/types/searchTypes
 * @author Margarita Kattsyna
 * @version 1.0.0
 * @since 1.0.0
 */
export interface ClubSummary {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
}

export interface UserSummary {
    _id: string;
    name: string;
    email: string;
    profileImageUrl: string;
    role: string;
}

export interface MeetingSummary {
    _id: string;
    title: string;
    agenda: string;
    date: string;
    location: string;
    clubId: string;
}

/**
 * Route suggestion for category-based searches
 * @interface RouteSuggestion
 * @description Provides navigation suggestions when users search for entity categories
 */
export interface RouteSuggestion {
    type: 'route';
    title: string;
    description: string;
    url: string;
    method: string;
    category: string;
}

/**
 * Response structure from the search API
 * @interface SearchResponse
 * @description Contains search results organized by entity type with optional properties
 * @example
 * ```typescript
 * const response: SearchResponse = {
 *   objects: [
 *     { club: clubData, type: 'club' },
 *     { user: userData, type: 'user' },
 *     { meeting: meetingData, type: 'meeting' }
 *   ]
 * };
 * ```
 * @since 1.0.0
 * @see {@link ClubSummary} - Club entity data
 * @see {@link UserSummary} - User entity data
 * @see {@link MeetingSummary} - Meeting entity data
 * @see {@link RouteSuggestion} - Route suggestion data
 */
export interface SearchResponse {
    objects: {
        club?: ClubSummary;
        user?: UserSummary;
        meeting?: MeetingSummary;
        route?: RouteSuggestion;
        type: 'club' | 'user' | 'meeting' | 'route';
    }[];
}

/**
 * Processed search results organized by entity type
 * @interface SearchLoaderResult
 * @description Contains search results organized into separate arrays for easy consumption by components
 * @example
 * ```typescript
 * const loaderResult: SearchLoaderResult = {
 *   searchResults: {
 *     clubs: [club1, club2],
 *     users: [user1, user2],
 *     meetings: [meeting1],
 *     routes: [route1]
 *   }
 * };
 * ```
 * @since 1.0.0
 * @see {@link ClubSummary} - Club entity data
 * @see {@link UserSummary} - User entity data
 * @see {@link MeetingSummary} - Meeting entity data
 * @see {@link RouteSuggestion} - Route suggestion data
 */
export interface SearchLoaderResult {
    searchResults: {
        clubs: ClubSummary[];
        users: UserSummary[];
        meetings: MeetingSummary[];
        routes: RouteSuggestion[];
    };
}