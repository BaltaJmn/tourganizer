export interface User {
    id?: string;

    profile: string;
    username: string;
    password: string;

    email: string;
    confirmed: boolean;

    rol: number;

    followers: Array<string>;
    follows: Array<string>;
    
    createdRoutes: Array<string>;
    savedRoutes: Array<string>;
}