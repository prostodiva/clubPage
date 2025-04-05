import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await meetingService.getAllMeetings();
                setMeetings(data);
            } catch (err) {
                console.error('Error fetching meetings:', err);
                setError(err.message || 'Failed to load meetings');
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    return (
        <section className="meetings py-16 px-4">
            <div className="text-center mb-16">
                <h3 className="members-title text-4xl font-bold tracking-wider">Upcoming Meetings</h3>
            </div>
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-4">Loading meetings</p>
                </div>
            )}
            {error && (
                <div className="text-center py-12 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {meetings.length > 0 ? (
                        meetings.map((meeting) => (
                            <Card key={meeting._id} className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>{meeting.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
                                        <p><strong>Location:</strong> {meeting.location}</p>
                                        <p><strong>Agenda:</strong> {meeting.agenda}</p>
                                        {meeting.clubId && (
                                            <p><strong>Club:</strong> {meeting.clubId.title}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <p>No meetings found.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Meetings;