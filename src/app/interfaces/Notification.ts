export interface Notification {
    id?: string;
    content: string;
    sender: string;
    receiver: string;
    seen?: boolean;
}
