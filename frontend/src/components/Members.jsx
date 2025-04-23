import { Button } from "@/components/ui/button.jsx";
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/memberService.js';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/users/all', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            setMembers(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching members:", error);
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchMembers();
        } else {
            setError('Please log in to view members');
            setLoading(false);
        }
    }, [user?.token]);

    const handleDelete = useCallback(async (memberId) => {
        if (!user?.token) {
            setError('You must be logged in to delete members');
            return;
        }

        try {
            await memberService.deleteMember(memberId, user.token);
            setMembers(prevMembers => prevMembers.filter(m => m._id !== memberId));
        } catch (error) {
            console.error('Delete member error:', error);
            setError('Failed to delete member');
        }
    }, [user?.token]);

    return (
        <section id="members" className="members py-16 px-4 bg-white">
            <div className="text-center mb-16">
                <h3 className="members-title text-4xl font-bold tracking-wider">MEET OUR MEMBERS</h3>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-4">Loading members...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-12 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <Card key={member._id} className="overflow-hidden flex flex-col shadow-lg h-[300px] bg-white">
                                <div className="relative h-[180px] bg-gray-100">
                                    <img
                                        src={member.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F3F4F6&color=374151`}
                                        alt={member.name}
                                        className="absolute inset-0 w-full h-full object-cover bg-gray-100"
                                    />
                                </div>
                                <CardContent className="p-4 flex-grow bg-white">
                                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                    {member.role && <p className="text-gray-600">{member.role}</p>}
                                    {member.email && <p className="text-gray-600">{member.email}</p>}
                                </CardContent>
                                {isAdmin && (
                                    <CardFooter className="flex justify-end space-x-2 bg-white">
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(member._id)}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <p>No members found.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Members;