import React from 'react';
import { Card } from '../components/ui/card';
import eventWorkshop from '../static/images/events.jpg';
import eventHack from '../static/images/hack.jpg';
import eventCoffee from '../static/images/coffee.jpg';

const upcomingEvents = [
    {
        id: 1,
        title: 'Hackathon 2025',
        date: '2025-04-15',
        description: '24-hour coding challenge with amazing prizes',
        category: 'Competition',
        image: eventHack,
        url: "https://mlh.io/seasons/2025/events"
    },
    {
        id: 2,
        title: 'Tech Talk: AI in 2025',
        date: '2025-03-20',
        description: 'Industry experts discuss the latest in AI',
        category: 'Workshop',
        image: eventWorkshop
    },
    {
        id: 3,
        title: 'Code & Coffee',
        date: '2025-03-25',
        description: 'Casual coding session with free coffee',
        category: 'Social',
        image: eventCoffee
    }
];

const Events = () => {
    return (
        <section className="py-16" id="events">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
                <p className="text-gray-600">Join us for these exciting events</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                        <div className="relative h-48">
                            {event.url ? (
                                <a href={event.url} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={event.image || "/placeholder.svg"}
                                        alt={event.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                                            {event.category}
                                        </span>
                                    </div>
                                </a>
                            ) : (
                                <>
                                    <img
                                        src={event.image || "/placeholder.svg"}
                                        alt={event.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                                            {event.category}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Events;