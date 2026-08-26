import { calendar } from "../../integrations/google/googleCalendar";
import { presenceStore } from "../../store/presence.store";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";

const confirmPresenceService = async (phone: string) => {
    console.log("========== [CONFIRM PRESENCE] ==========");

    console.log(
        "[CONFIRM] Telefone recebido:",
        phone
    );

    console.log(
        "[CONFIRM] PresenceStore:",
        presenceStore
    );

    const presence = presenceStore.find(item => item.phone === phone);
    console.log(
        "[CONFIRM] Presence encontrada:",
        presence
    );

    if (!presence) {

        console.log(
            "[CONFIRM] ❌ Presence não encontrada."
        );
        return false
    };

    const eventId = presence.id;

    console.log(
        "[CONFIRM] Event ID:",
        eventId
    );

    console.log(
        "[CONFIRM] Buscando evento no Google Calendar..."
    );

    const { data } = await calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        eventId,
    });

    console.log(
        "[CONFIRM] Evento encontrado no Google Calendar:",
        data.id
    );

    const desc = data.description || "";

    console.log(
        "[CONFIRM] Descrição antiga:",
        desc
    );

    await calendar.events.patch({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        eventId,
        requestBody: {
            description: desc.replace(/Status: .*/, "Status: Confirmado"),
        },
    });

    console.log(
        "[CONFIRM] ✅ Status alterado para Confirmado."
    );

    console.log(
        "[CONFIRM] Enviando WhatsApp..."
    );

    await sendConfirmedPresenceService({
        phone,
        text: "✅ Presença confirmada. Obrigado!",
    });

    console.log(
        "[CONFIRM] ✅ WhatsApp de confirmação enviado."
    );

    const index = presenceStore.indexOf(presence);
    if (index !== -1) {

        presenceStore.splice(index, 1)
        console.log(
            "[CONFIRM] Presence removida do store."
        );
    };

    console.log(
        "========== [CONFIRM PRESENCE] FIM =========="
    );

    return true;
}


export default confirmPresenceService