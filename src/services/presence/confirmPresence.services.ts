import { calendar } from "../../integrations/google/googleCalendar";
import { presenceStore } from "../../store/presence.store";
import { sendConfirmedPresence } from "./sendConfirmedPresence.services";

export async function confirmPresenceService(phone: string) {
    // encontra a presença no store
    const presence = presenceStore.find(item => item.phone === phone);
    if (!presence) return false;

    const eventId = presence.id;

    // 1️⃣ Atualiza status no Google Calendar
    // primeiro pega o evento atual
    const { data } = await calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        eventId,
    });

    const desc = data.description || "";

    await calendar.events.patch({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        eventId,
        requestBody: {
            description: desc.replace(/Status: .*/, "Status: Confirmado"),
        },
    });

    // 2️⃣ Envia mensagem WhatsApp
    await sendConfirmedPresence({
        phone,
        text: "✅ Presença confirmada. Obrigado!",
    });

    // 3️⃣ Remove do store
    const index = presenceStore.indexOf(presence);
    if (index !== -1) presenceStore.splice(index, 1);

    return true;
}
