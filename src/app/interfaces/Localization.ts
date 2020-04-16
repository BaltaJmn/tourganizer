export interface Localization {
    id?: string;
    userId: string;
    name: string;
    description: string;

    latitude: string;
    longitude: string;

    likes: number;
    url: string;

    images: Array<string>;
}