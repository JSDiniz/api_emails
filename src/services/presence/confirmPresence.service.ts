import { calendar } from "../../integrations/google/googleCalendar";
import { presenceStore } from "../../store/presence.store";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";

const confirmPresenceService = async (phone: string) => {
    const presence = presenceStore.find(item => item.phone === phone);
    if (!presence) return false;

    const eventId = presence.id;

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

    await sendConfirmedPresenceService({
        phone,
        text: "✅ Presença confirmada. Obrigado!",
    });

    const index = presenceStore.indexOf(presence);
    if (index !== -1) presenceStore.splice(index, 1);

    return true;
}


export default confirmPresenceService