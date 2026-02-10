import { calendar } from "../../integrations/google/googleCalendar";

const updateGoogleCalendarEventService = async (eventId: string) => {

    try {
        // 1️⃣ Pega o evento atual
        const { data } = await calendar.events.get({
            calendarId: process.env.GOOGLE_CALENDAR_ID as string,
            eventId,
        });

        const desc = data.description || "";

        // 2️⃣ Atualiza a descrição do evento
        await calendar.events.patch({
            calendarId: process.env.GOOGLE_CALENDAR_ID as string,
            eventId,
            requestBody: {
                description: desc.replace(/Status: .*/, "Status: Confirmado"),
            },
        });

        console.log(`✅ Evento ${eventId} atualizado para Confirmado`);
        return true;
    } catch (error) {
        console.error("❌ Erro ao atualizar evento do Google Calendar:", error);
        return false;
    }
};

export default updateGoogleCalendarEventService;
