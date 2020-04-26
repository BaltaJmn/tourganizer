export interface Route {
    id?: string;
    userId: string;
    name: string;
    type: string;

    totalTime: number;
    
    rating: {
        show: number;
        total: number;
        votes: Array<string>;
    };

    localizations: Array<string>;
}