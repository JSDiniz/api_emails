import { calendar } from "../../integrations/google/googleCalendar";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";
import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";

const confirmPresenceService = async (phone: string) => {

    console.log("\n========== [CONFIRM PRESENCE] ==========");

    console.log("[CONFIRM] Telefone recebido:", phone);

    const normalizedPhone = phone;

    console.log("[CONFIRM] Telefone recebido:", phone);
    console.log("[CONFIRM] Telefone utilizado na busca:", normalizedPhone);

    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
        console.error("[CONFIRM] ❌ GOOGLE_CALENDAR_ID não configurado");
        return false;
    }

    /*
     * Busca eventos futuros no Google Calendar.
     *
     * Não usamos mais o presenceStore.
     */
    const now = new Date();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);

    console.log("[CONFIRM] Buscando eventos no Google Calendar...");

    const { data } = await calendar.events.list({
        calendarId,
        timeMin: now.toISOString(),
        timeMax: futureDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
    });

    const events = data.items || [];

    console.log("[CONFIRM] Eventos encontrados:", events.length);

    /*
     * Procura o evento pelo telefone dentro da descrição.
     */
    const event = events.find((event) => {

        const description = event.description || "";

        const descriptionDigits = description.replace(/\D/g, "");

        const phoneDigits = normalizedPhone.replace(/\D/g, "");

        const phoneWithoutCountryCode = phoneDigits.startsWith("55")
            ? phoneDigits.slice(2)
            : phoneDigits;

        return (
            descriptionDigits.includes(phoneDigits) ||
            descriptionDigits.includes(phoneWithoutCountryCode)
        );
    });

    if (!event) {

        console.log(
            "[CONFIRM] ❌ Nenhum agendamento encontrado para:",
            normalizedPhone
        );

        console.log("========================================\n");

        return false;
    }

    console.log("[CONFIRM] ✅ Agendamento encontrado!");
    console.log("[CONFIRM] Event ID:", event.id);
    console.log("[CONFIRM] Título:", event.summary);

    const eventId = event.id;

    if (!eventId) {
        console.error("[CONFIRM] ❌ Evento não possui ID");
        return false;
    }

    const description = event.description || "";

    console.log("[CONFIRM] Descrição atual:");
    console.log(description);

    /*
     * Verifica se o agendamento já foi confirmado.
     */
    if (/Status:\s*Confirmado/i.test(description)) {

        console.log(
            "[CONFIRM] ⚠️ Agendamento já estava confirmado."
        );

        console.log("========================================\n");

        return false;
    }

    /*
     * Verifica se realmente está como Agendado.
     */
    if (!/Status:\s*Agendado/i.test(description)) {

        console.log(
            "[CONFIRM] ⚠️ Evento encontrado, mas não está como Agendado."
        );

        console.log("========================================\n");

        return false;
    }

    /*
     * Atualiza o status no Google Calendar.
     */
    const updatedDescription = description.replace(
        /Status:\s*Agendado/i,
        "Status: Confirmado"
    );

    console.log("[CONFIRM] Atualizando status no Google Calendar...");

    await calendar.events.patch({
        calendarId,
        eventId,
        requestBody: {
            description: updatedDescription,
        },
    });

    console.log(
        "[CONFIRM] ✅ Status atualizado para Confirmado."
    );

    /*
     * Envia confirmação pelo WhatsApp.
     */
    console.log(
        "[CONFIRM] Enviando mensagem de confirmação..."
    );

    await sendConfirmedPresenceService({
        phone: normalizedPhone,
        text: "✅ Presença confirmada. Obrigado!",
    });

    console.log(
        "[CONFIRM] ✅ Mensagem de confirmação enviada."
    );

    console.log("========================================\n");

    return true;
};

export default confirmPresenceService;