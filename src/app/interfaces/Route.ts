export interface Route {
    id?: string;
    userId: string;
    name: string;
    type: string;

    totalTime: number;
    
    ratingTotal: number;
    votes: number;

    localizations: Array<string>;
}