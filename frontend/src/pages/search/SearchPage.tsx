/**
 * Search results page component
 * Displays search results organized by entity type with proper TypeScript types
 * @module pages/search/SearchPage
 * @author Margarita Kattsyna
 */

import { useLoaderData } from 'react-router-dom';
import type { ClubSummary, MeetingSummary, RouteSuggestion, SearchLoaderResult, UserSummary } from '../../store/api/types/searchTypes';

/**
 * Search page component that displays organized search results
 * Renders search results grouped by entity type (clubs, users, meetings, routes)
 * @returns The search results page with organized content sections
 * @see {@link SearchLoaderResult} - Type definition for search results
 */
export function SearchPage() {
  const { searchResults } = useLoaderData() as SearchLoaderResult;
  const { clubs, users, meetings, routes } = searchResults;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>

      {/* Route Suggestions */}
      {routes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route: RouteSuggestion, index: number) => (
              <button
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                onClick={() => (window.location.href = route.url)}
              >
                <h3 className="font-semibold">{route.title}</h3>
                <p className="text-gray-600">{route.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clubs */}
      {clubs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club: ClubSummary) => (
              <div key={club._id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{club.title}</h3>
                <p className="text-gray-600">{club.description}</p>
                {club.imageUrl && (
                  <img
                    src={club.imageUrl}
                    alt={club.title}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users */}
      {users.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user: UserSummary) => (
              <div key={user._id} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meetings */}
      {meetings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting: MeetingSummary) => (
              <div key={meeting._id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{meeting.title}</h3>
                <p className="text-gray-600">{meeting.agenda}</p>
                <p className="text-sm text-gray-500">{meeting.date}</p>
                <p className="text-sm text-gray-500">{meeting.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {clubs.length === 0 &&
        users.length === 0 &&
        meetings.length === 0 &&
        routes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No results found</p>
          </div>
        )}
    </div>
  );
}
