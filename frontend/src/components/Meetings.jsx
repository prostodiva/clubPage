import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';

const EditMeetingDialog = ({ meeting, onSave, onClose, open }) => {
    const [formData, setFormData] = useState({
        title: meeting.title,
        agenda: meeting.agenda,
        date: new Date(meeting.date).toISOString().split('T')[0],
        location: meeting.location
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error in EditMeetingDialog:', error);
            // Let the parent component handle the error
            throw error;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader className="bg-white">
                    <DialogTitle className="text-gray-900">Edit Meeting</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                            className="w-full bg-white border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="agenda" className="text-sm font-medium text-gray-700">Agenda</label>
                        <Textarea
                            id="agenda"
                            value={formData.agenda}
                            onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                            required
                            className="w-full bg-white border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                            className="w-full bg-white border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            required
                            className="w-full bg-white border-gray-300"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { user } = useAuth();

    // Debug logging
    console.log('Raw user object:', user);
    console.log('User token:', user?.token);
    const isAdmin = user?.role === 'Admin';
    console.log('User role:', user?.role);
    console.log('Is admin:', isAdmin);

    const showToast = useCallback((type, message) => {
        toast({
            title: type === 'success' ? 'Success' : 'Error',
            description: message,
            variant: type === 'success' ? 'default' : 'destructive'
        });
    }, []);

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

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleCreateMeeting = useCallback(async (formData) => {
        try {
            const meetingData = {
                title: formData.get('title'),
                agenda: formData.get('agenda'),
                date: formData.get('date'),
                location: formData.get('location'),
                attachments: []
            };
            
            // Let meetingService handle getting the club ID
            await meetingService.createMeeting(meetingData, user.token);
            await fetchMeetings();
            setDialogOpen(false);
            toast({
                title: "Success",
                description: "Meeting created successfully"
            });
        } catch (error) {
            console.error('Create meeting error:', error);
            // Show a more specific error message if it's club-related
            const errorMessage = error.message.includes('club')
                ? error.message
                : "Failed to create meeting. Please try again.";
            
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }, [user.token, fetchMeetings]);

    const handleDelete = useCallback(async (meetingId) => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) {
            return;
        }

        try {
            const meeting = meetings.find(m => m._id === meetingId);
            if (!meeting?.clubId?._id) {
                toast({
                    title: "Error",
                    description: "Could not find club ID for this meeting",
                    variant: "destructive"
                });
                return;
            }

            await meetingService.deleteMeeting(meetingId, meeting.clubId._id, user.token);
            setMeetings(prevMeetings => prevMeetings.filter(m => m._id !== meetingId));
            toast({
                title: "Success",
                description: "Meeting deleted successfully"
            });
        } catch (error) {
            console.error('Delete meeting error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete meeting",
                variant: "destructive"
            });
        }
    }, [meetings, user.token]);

    const handleUpdate = useCallback(async (meetingId, updatedData) => {
        try {
            const meeting = meetings.find(m => m._id === meetingId);
            if (!meeting?.clubId?._id) {
                toast({
                    title: "Error",
                    description: "Could not find club ID for this meeting",
                    variant: "destructive"
                });
                return;
            }

            await meetingService.updateMeeting(
                meetingId,
                meeting.clubId._id,
                { ...updatedData, attachments: [] }, // Add empty attachments array as it's required by backend
                user.token
            );

            setMeetings(prevMeetings =>
                prevMeetings.map(m =>
                    m._id === meetingId
                        ? { ...m, ...updatedData }
                        : m
                )
            );
            setEditingMeeting(null);
            setEditDialogOpen(false);
            toast({
                title: "Success",
                description: "Meeting updated successfully"
            });
        } catch (error) {
            console.error('Error updating meeting:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update meeting",
                variant: "destructive"
            });
        }
    }, [meetings, user.token]);

    return (
        <section className="meetings py-16 px-4">
            <div className="text-center mb-16">
                <h3 className="members-title text-4xl font-bold tracking-wider">Upcoming Meetings</h3>
                {isAdmin && (
                    <div className="mt-4 flex justify-center">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="default" 
                                    size="lg" 
                                    className="font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                                >
                                    + Create New Meeting
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader className="bg-white">
                                    <DialogTitle className="text-gray-900">Create New Meeting</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCreateMeeting(new FormData(e.target));
                                }} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter meeting title"
                                            required
                                            className="w-full bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="agenda" className="text-sm font-medium text-gray-700">Agenda</label>
                                        <Textarea
                                            id="agenda"
                                            name="agenda"
                                            placeholder="Enter meeting agenda"
                                            required
                                            className="w-full bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="datetime-local"
                                            required
                                            className="w-full bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Enter meeting location"
                                            required
                                            className="w-full bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setDialogOpen(false)}
                                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit"
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                                        >
                                            Create Meeting
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
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
                                {isAdmin && (
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button 
                                            variant="outline"
                                            onClick={() => {
                                                setEditingMeeting(meeting);
                                                setEditDialogOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="destructive"
                                            onClick={() => handleDelete(meeting._id)}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <p>No meetings found.</p>
                        </div>
                    )}
                </div>
            )}
            {editingMeeting && (
                <EditMeetingDialog
                    meeting={editingMeeting}
                    onSave={(updatedData) => handleUpdate(editingMeeting._id, updatedData)}
                    onClose={() => {
                        setEditingMeeting(null);
                        setEditDialogOpen(false);
                    }}
                    open={editDialogOpen}
                />
            )}
        </section>
    );
};

export default Meetings;