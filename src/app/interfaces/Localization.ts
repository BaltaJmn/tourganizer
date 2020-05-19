export interface Localization {
    id?: string;
    userId: string;
    profile: string;
    name: string;
    description: string;

    confirmed: boolean;

    latitude: string;
    longitude: string;

    likes: Array<string>;
    
    url: string;

    images: Array<string>;
}