export interface Route {
    id?: string;
    userId: string;
    name: string;
    localizations: Array<string>;
    rating: number;
    ratingTotal: number;
    votes: number;
}