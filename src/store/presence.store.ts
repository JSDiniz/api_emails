export interface PresenceTemp {
    id: string;       // appointmentId / eventId do Google Calendar
    phone: string;    // número do paciente, ex: 5591999999999
    date?: string;     // data do agendamento, ex: "2026-02-09"
    time?: string;     // horário do agendamento, ex: "10:00"
    status?: "pending" | "confirmed" | "cancelled"; // status da resposta
}

export const presenceStore: PresenceTemp[] = [];
