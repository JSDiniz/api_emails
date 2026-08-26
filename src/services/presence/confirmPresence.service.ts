import { calendar } from "../../integrations/google/googleCalendar";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";

const confirmPresenceService = async (phone: string) => {
    console.log("\n========== [CONFIRM PRESENCE] ==========");

    console.log("[CONFIRM] Telefone recebido:", phone);

    const normalizedPhone = phone.replace(/\D/g, "");

    console.log(
        "[CONFIRM] Telefone utilizado na busca:",
        normalizedPhone
    );

    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
        console.error(
            "[CONFIRM] ❌ GOOGLE_CALENDAR_ID não configurado"
        );

        return false;
    }

    /*
     * Busca os próximos eventos.
     *
     * Importante:
     * Não procuramos mais simplesmente qualquer evento
     * dos próximos 90 dias.
     *
     * Buscamos os próximos eventos e depois selecionamos
     * o primeiro agendamento válido daquele telefone.
     */

    const now = new Date();

    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + 90);

    console.log(
        "[CONFIRM] Buscando próximos eventos no Google Calendar..."
    );

    const { data } = await calendar.events.list({
        calendarId,

        timeMin: now.toISOString(),
        timeMax: futureDate.toISOString(),

        singleEvents: true,
        orderBy: "startTime",

        maxResults: 2500,
    });

    const events = data.items || [];

    console.log(
        "[CONFIRM] Eventos encontrados:",
        events.length
    );

    /*
     * Procura o PRIMEIRO evento:
     *
     * 1. Que tenha o telefone
     * 2. Que esteja como "Agendado"
     *
     * Como o Google Calendar está ordenado por startTime,
     * o primeiro encontrado será o próximo agendamento
     * daquele telefone.
     */

    const phoneDigits = normalizedPhone;

    const phoneWithoutCountryCode =
        phoneDigits.startsWith("55")
            ? phoneDigits.slice(2)
            : phoneDigits;

    const event = events.find((event) => {
        const description = event.description || "";

        const descriptionDigits =
            description.replace(/\D/g, "");

        const hasPhone =
            descriptionDigits.includes(phoneDigits) ||
            descriptionDigits.includes(phoneWithoutCountryCode);

        const isScheduled =
            /Status:\s*Agendado/i.test(description);

        return hasPhone && isScheduled;
    });

    if (!event) {
        console.log(
            "[CONFIRM] ❌ Nenhum agendamento AGENDADO encontrado para:",
            normalizedPhone
        );

        console.log(
            "========================================\n"
        );

        return false;
    }

    console.log(
        "[CONFIRM] ✅ Próximo agendamento encontrado!"
    );

    console.log(
        "[CONFIRM] Event ID:",
        event.id
    );

    console.log(
        "[CONFIRM] Título:",
        event.summary
    );

    console.log(
        "[CONFIRM] Início:",
        event.start?.dateTime || event.start?.date
    );

    const eventId = event.id;

    if (!eventId) {
        console.error(
            "[CONFIRM] ❌ Evento não possui ID"
        );

        return false;
    }

    const description = event.description || "";

    console.log(
        "[CONFIRM] Descrição atual:"
    );

    console.log(description);

    /*
     * Atualiza somente o evento que foi encontrado.
     */

    const updatedDescription = description.replace(
        /Status:\s*Agendado/i,
        "Status: Confirmado"
    );

    console.log(
        "[CONFIRM] Atualizando status no Google Calendar..."
    );

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

    console.log(
        "========================================\n"
    );

    return true;
};

export default confirmPresenceService;