// pages/SearchPage.tsx
import { useLoaderData, useNavigate } from 'react-router-dom';
import type { SearchLoaderResult } from './searchLoader';

export function SearchPage() {
    const { searchResults } = useLoaderData() as SearchLoaderResult;
    const { clubs, users, meetings, routes } = searchResults;
    const navigate = useNavigate();

    return (
        <div className="search-results">
            <h2>Search Results</h2>

            {/* Route Suggestions */}
            {routes.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                    <div className="grid gap-3">
                        {routes.map((route, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                                <h4 className="font-semibold text-blue-800">{route.title}</h4>
                                <p className="text-blue-600 text-sm mb-3">{route.description}</p>
                                <button 
                                    onClick={() => navigate(route.url)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Browse {route.category}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Clubs Results */}
            {clubs.length > 0 && (
                <section>
                    <h3>Clubs ({clubs.length})</h3>
                    {clubs.map(club => (
                        <div key={club._id} className="club-result">
                            <img src={club.imageUrl} alt={club.title} />
                            <div>
                                <h4>{club.title}</h4>
                                <p>{club.description}</p>
                                <span>Created: {new Date(club.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Users Results */}
            {users.length > 0 && (
                <section>
                    <h3>Users ({users.length})</h3>
                    {users.map(user => (
                        <div key={user._id} className="user-result">
                            <img src={user.profileImageUrl} alt={user.name} />
                            <div>
                                <h4>{user.name}</h4>
                                <p>{user.email}</p>
                                <span>Role: {user.role}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Meetings Results */}
            {meetings.length > 0 && (
                <section>
                    <h3>Meetings ({meetings.length})</h3>
                    {meetings.map(meeting => (
                        <div key={meeting._id} className="meeting-result">
                            <div>
                                <h4>{meeting.title}</h4>
                                <p>{meeting.agenda}</p>
                                <p>Location: {meeting.location}</p>
                                <span>Date: {new Date(meeting.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {clubs.length === 0 && users.length === 0 && meetings.length === 0 && routes.length === 0 && (
                <p>No results found</p>
            )}
        </div>
    );
}