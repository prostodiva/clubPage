import { Button } from "@/components/ui/button.jsx";
import Axios from 'axios';
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

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);

                console.log('Requesting config', {
                    url: 'http://localhost:8080/users/all',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const response = await Axios.get(`http://localhost:8080/users/all`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    }
                });

                console.log('response status:', response.status);
                console.log('response data:', response.data);

                setMembers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("error fetching members: ", error);
                setError('failed to load members');
                setLoading(false);
            }
        };
        if (!user) {
            setLoading(false);
            setError('please log in to view members');
        } else {
            fetchMembers();
        }
    }, [user]);

    const handleDelete = useCallback(async (memberId) => {
        try {
            const member = members.find(m => m._id === memberId);
            if (!member?._id) {
                console.error('Could not find member with _id', memberId);
                return;
            }

            await memberService.deleteMember(memberId, user.token);
            setMembers(prevMembers => prevMembers.filter(m => m._id !== memberId));
            console.log('Member deleted successfully');
        } catch (error) {
            console.error('delete member error', error);
        }
    }, [members, user?.token]);

    return (
        <section id="members" className="members py-16 px-4">
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
                            <Card key={member.id} className="overflow-hidden flex flex-col shadow-lg h-[300px]">
                                <div className="relative h-[180px]">
                                    <img
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4 flex-grow">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    {member.role && <p className="text-gray-500">{member.role}</p>}
                                    {member.year && <p className="text-gray-500">Year: {member.year}</p>}
                                </CardContent>
                                {isAdmin && (
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(member.id)}
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