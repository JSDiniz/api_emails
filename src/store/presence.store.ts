export interface PresenceTemp {
    id: string;
    phone: string;
    date?: string;
    time?: string;
    status?: "pending" | "confirmed" | "cancelled";
}

export const presenceStore: PresenceTemp[] = [];
