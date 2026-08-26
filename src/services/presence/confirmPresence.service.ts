import { calendar } from "../../integrations/google/googleCalendar";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";
import { getManausDate, getTomorrowManausDate } from "../../utils/date.utils";

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

    // ==========================================
    // DATA DO AGENDAMENTO
    // ==========================================

    const tomorrowManaus = getTomorrowManausDate();

    console.log(
        "[CONFIRM] Data atual em Manaus:",
        getManausDate()
    );

    console.log(
        "[CONFIRM] Buscando agendamento de amanhã:",
        tomorrowManaus
    );

    // ==========================================
    // INTERVALO DO DIA EM MANAUS
    // ==========================================

    const startOfDay = new Date(
        `${tomorrowManaus}T00:00:00-04:00`
    );

    const endOfDay = new Date(
        `${tomorrowManaus}T23:59:59.999-04:00`
    );

    console.log(
        "[CONFIRM] Início do período:",
        startOfDay.toISOString()
    );

    console.log(
        "[CONFIRM] Fim do período:",
        endOfDay.toISOString()
    );

    // ==========================================
    // BUSCAR SOMENTE EVENTOS DE AMANHÃ
    // ==========================================

    const { data } = await calendar.events.list({
        calendarId,

        timeMin: startOfDay.toISOString(),

        timeMax: endOfDay.toISOString(),

        singleEvents: true,

        orderBy: "startTime",

        maxResults: 2500,
    });

    const events = data.items || [];

    console.log(
        "[CONFIRM] Eventos encontrados para",
        tomorrowManaus,
        ":",
        events.length
    );

    // ==========================================
    // NORMALIZAÇÃO DO TELEFONE
    // ==========================================

    const phoneDigits = normalizedPhone;

    const phoneWithoutCountryCode =
        phoneDigits.startsWith("55")
            ? phoneDigits.slice(2)
            : phoneDigits;

    // ==========================================
    // PROCURAR AGENDAMENTO
    // ==========================================

    const event = events.find((event) => {

        const description =
            event.description || "";

        const descriptionDigits =
            description.replace(/\D/g, "");

        const hasPhone =
            descriptionDigits.includes(phoneDigits) ||
            descriptionDigits.includes(
                phoneWithoutCountryCode
            );

        const isScheduled =
            /Status:\s*Agendado/i.test(
                description
            );

        return (
            hasPhone &&
            isScheduled
        );
    });

    if (!event) {

        console.log(
            "[CONFIRM] ❌ Nenhum agendamento AGENDADO encontrado para:",
            normalizedPhone
        );

        console.log(
            "[CONFIRM] Data procurada:",
            tomorrowManaus
        );

        console.log(
            "========================================\n"
        );

        return false;
    }

    console.log(
        "[CONFIRM] ✅ Agendamento encontrado!"
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
        event.start?.dateTime ||
        event.start?.date
    );

    const eventId = event.id;

    if (!eventId) {

        console.error(
            "[CONFIRM] ❌ Evento não possui ID"
        );

        return false;
    }

    const description =
        event.description || "";

    console.log(
        "[CONFIRM] Descrição atual:"
    );

    console.log(description);

    // ==========================================
    // VERIFICAR STATUS
    // ==========================================

    if (
        /Status:\s*Confirmado/i.test(
            description
        )
    ) {

        console.log(
            "[CONFIRM] ⚠️ Agendamento já estava confirmado."
        );

        console.log(
            "========================================\n"
        );

        return false;
    }

    if (
        !/Status:\s*Agendado/i.test(
            description
        )
    ) {

        console.log(
            "[CONFIRM] ⚠️ Evento encontrado, mas não está como Agendado."
        );

        return false;
    }

    // ==========================================
    // ATUALIZAR STATUS
    // ==========================================

    const updatedDescription =
        description.replace(
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
            description:
                updatedDescription,
        },
    });

    console.log(
        "[CONFIRM] ✅ Status atualizado para Confirmado."
    );

    // ==========================================
    // ENVIAR WHATSAPP
    // ==========================================

    console.log(
        "[CONFIRM] Enviando mensagem de confirmação..."
    );

    await sendConfirmedPresenceService({
        phone: normalizedPhone,
        text:
            "✅ Presença confirmada. Obrigado!",
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