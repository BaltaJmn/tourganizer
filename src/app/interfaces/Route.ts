export interface Route {
    id?: string;

    userId: string;
    profile: string;
    name: string;
    type: string;

    confirmed: boolean;
    
    center: {
        latitude: string,
        longitude: string
    }

    totalTime: number;

    rating: {
        show: number;
        total: number;
        votes: Array<string>;
    };

    localizations: Array<string>;
}