export interface ClubSummary {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
}

export interface UserSummary {
    _id: string;
    name: string;
    email: string;
    profileImageUrl: string;
    role: string;
}

export interface MeetingSummary {
    _id: string;
    title: string;
    agenda: string;
    date: string;
    location: string;
    clubId: string;
}


export interface RouteSuggestion {
    type: 'route';
    title: string;
    description: string;
    url: string;
    method: string;
    category: string;
}

export interface SearchResponse {
    objects: {
        club?: ClubSummary;
        user?: UserSummary;
        meeting?: MeetingSummary;
        route?: RouteSuggestion;
        type: 'club' | 'user' | 'meeting' | 'route';
    }[];
}