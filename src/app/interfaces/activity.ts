export interface Activity {
    id?: string,
    userId: string,
    date: string,
    type: number,
    content: string,
    new: boolean,
    profile: boolean
}
