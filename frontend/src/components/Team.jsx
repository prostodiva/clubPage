import React from 'react';
import {Card, CardContent} from "./ui/card.jsx"
import president from "../static/images/rita.jpg";
import vice from "../static/images/alex.jpg";
import eventCoordinator from "../static/images/sam.jpg";

const teamLeads = [
    {
        id: 1,
        title: 'President',
        image: president,
        name: 'Rita Kattsyna',
    },
    {
        id: 2,
        title: 'Vice President',
        image: vice,
        name: 'Alex Mcfly',
    },
    {
        id: 3,
        title: 'Advisor',
        image: eventCoordinator,
        name: 'Sam Klix'
    }
];

const Team = () => {
    return (
        <section className="team py-12 px-4 flex flex-col gap-16" id="team-section">
            <div>
                <h3 className="team-title">CABINET</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {teamLeads.map(team => (
                    <Card key={team.id} className="overflow-hidden flex flex-col shadow-lg h-[370px]">
                        <div className="relative h-[250px]">
                            <img src={team.image || "/placeholder.svg"}
                                 alt={team.title}
                                 className="absolute inset-0 w-full h-full"
                            />
                        </div>
                        <CardContent className="p-6 flex-grow">
                            <h3 className="text-gray-300">{team.title}</h3>
                            {team.name && <p className="text-gray-300">{team.name}</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Team;