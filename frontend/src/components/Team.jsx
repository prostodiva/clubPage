import React from 'react';
import { Card } from "./ui/card.jsx"
import president from "../static/images/hack.jpg";
import vice from "../static/images/events.jpg";
import eventCoordinator from "../static/images/coffee.jpg";

const teamLeads = [
    {
        id: 1,
        title: 'President',
        image: president,
    },
    {
        id: 2,
        title: 'Vice President',
        image: vice,
    },
    {
        id: 3,
        title: 'Event Coordinator',
        image: eventCoordinator,
    }
];

const Team = () => {
    return (
        <section className="team">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamLeads.map(team => (
                    <Card key={team.id} className="overflow-hidden">
                        <div className="relative h-48">
                            <img src={team.image || "/placeholder.svg"} alt={team.title} className="absolute inset-0 w-full h-full object-cover"/>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Team;