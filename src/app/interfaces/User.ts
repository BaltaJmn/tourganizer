export interface User {
    id?: string;

    profile: string;
    username: string;
    password: string;

    email: string;

    config: {
        confirmed: boolean,
        language: string,
        rol: number;
    };

    followers: Array<string>;
    follows: Array<string>;

    createdRoutes: Array<string>;
    savedRoutes: Array<string>;
}