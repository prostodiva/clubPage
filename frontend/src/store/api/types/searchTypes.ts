/**
 * TypeScript type definitions for search functionality
 * Defines interfaces for search responses, entity summaries, and loader results
 * @module store/api/types/searchTypes
 * @author Margarita Kattsyna
 */

/**
 * Summary information for a club entity
 * Compact representation of club data for search results and listings
 * @example
 * ```typescript
 * const club: ClubSummary = {
 *   _id: 'club123',
 *   title: 'JavaScript Developers Club',
 *   description: 'A club for JavaScript enthusiasts',
 *   imageUrl: 'https://example.com/club.jpg',
 *   createdAt: '2024-01-15T10:00:00Z'
 * };
 * ```
 */
export interface ClubSummary {
    /** Unique identifier for the club */
    _id: string;
    /** Display name of the club */
    title: string;
    /** Brief description of the club's purpose */
    description: string;
    /** Optional URL to the club's image */
    imageUrl?: string;
    /** ISO timestamp when the club was created */
    createdAt: string;
}

/**
 * Summary information for a user entity
 * Compact representation of user data for search results and listings
 * @example
 * ```typescript
 * const user: UserSummary = {
 *   _id: 'user123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   profileImageUrl: 'https://example.com/profile.jpg',
 *   role: 'member'
 * };
 * ```
 */
export interface UserSummary {
    /** Unique identifier for the user */
    _id: string;
    /** Full name of the user */
    name: string;
    /** Email address of the user */
    email: string;
    /** URL to the user's profile image */
    profileImageUrl: string;
    /** User's role in the system */
    role: string;
}

/**
 * Summary information for a meeting entity
 * Compact representation of meeting data for search results and listings
 * @example
 * ```typescript
 * const meeting: MeetingSummary = {
 *   _id: 'meeting123',
 *   title: 'Weekly JavaScript Discussion',
 *   agenda: 'Discuss new ES2024 features',
 *   date: '2024-02-01T14:00:00Z',
 *   location: 'Room 101',
 *   clubId: 'club123'
 * };
 * ```
 */
export interface MeetingSummary {
    /** Unique identifier for the meeting */
    _id: string;
    /** Title or name of the meeting */
    title: string;
    /** Brief description of what the meeting will cover */
    agenda: string;
    /** ISO timestamp when the meeting will occur */
    date: string;
    /** Physical or virtual location of the meeting */
    location: string;
    /** Reference to the club that owns this meeting */
    clubId: string;
}

/**
 * Route suggestion for category-based searches
 * Provides navigation suggestions when users search for entity categories
 * @example
 * ```typescript
 * const route: RouteSuggestion = {
 *   type: 'route',
 *   title: 'View All Users',
 *   description: 'Browse all registered users',
 *   url: '/users',
 *   method: 'GET',
 *   category: 'users'
 * };
 * ```
 */
export interface RouteSuggestion {
    /** Always 'route' to identify this as a route suggestion */
    type: 'route';
    /** Display text for the route suggestion */
    title: string;
    /** Description of what the route provides */
    description: string;
    /** URL path for the suggested route */
    url: string;
    /** HTTP method for the route */
    method: string;
    /** Category this route belongs to (users, clubs, meetings) */
    category: string;
}

/**
 * Response structure from the search API
 * Contains search results organized by entity type with optional properties
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
 * @see {@link ClubSummary} - Club entity data
 * @see {@link UserSummary} - User entity data
 * @see {@link MeetingSummary} - Meeting entity data
 * @see {@link RouteSuggestion} - Route suggestion data
 */
export interface SearchResponse {
    /** Array of search result objects, each containing one entity type */
    objects: {
        /** Optional club data if this result is a club */
        club?: ClubSummary;
        /** Optional user data if this result is a user */
        user?: UserSummary;
        /** Optional meeting data if this result is a meeting */
        meeting?: MeetingSummary;
        /** Optional route suggestion if this result is a route */
        route?: RouteSuggestion;
        /** Type identifier for the entity in this result */
        type: 'club' | 'user' | 'meeting' | 'route';
    }[];
}

/**
 * Processed search results organized by entity type
 * Contains search results organized into separate arrays for easy consumption by components
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
 * @see {@link ClubSummary} - Club entity data
 * @see {@link UserSummary} - User entity data
 * @see {@link MeetingSummary} - Meeting entity data
 * @see {@link RouteSuggestion} - Route suggestion data
 */
export interface SearchLoaderResult {
    /** Organized search results grouped by entity type */
    searchResults: {
        /** Array of club summaries found in search */
        clubs: ClubSummary[];
        /** Array of user summaries found in search */
        users: UserSummary[];
        /** Array of meeting summaries found in search */
        meetings: MeetingSummary[];
        /** Array of route suggestions for category searches */
        routes: RouteSuggestion[];
    };
}