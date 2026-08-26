import { Request, Response } from "express";

import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";

import sendConfirmedPresenceService from "../../services/presence/sendConfirmedPresence.service";

import deleteAppointmentService from "../../services/appointment/deleteAppointment.service";

import confirmPresenceService from "../../services/presence/confirmPresence.service";

import { calendar } from "../../integrations/google/googleCalendar";

import {
    getManausDate,
    getTomorrowManausDate,
} from "../../utils/date.utils";

const evolutionWebhookController = async (
    req: Request,
    res: Response
) => {
    console.log(
        "========== [EVOLUTION WEBHOOK] =========="
    );

    console.log(
        "[WEBHOOK] Body recebido:",
        JSON.stringify(req.body, null, 2)
    );

    // ==========================================
    // RECEBER MENSAGEM
    // ==========================================

    const message =
        req.body?.data?.message?.conversation ||
        req.body?.data?.message?.extendedTextMessage?.text;

    const phoneRaw =
        req.body?.data?.key?.remoteJid
            ?.replace("@s.whatsapp.net", "");

    console.log(
        "[WEBHOOK] Mensagem:",
        message
    );

    console.log(
        "[WEBHOOK] phoneRaw:",
        phoneRaw
    );

    if (!message || !phoneRaw) {
        console.log(
            "[WEBHOOK] Mensagem ou telefone ausente."
        );

        return res.sendStatus(200);
    }

    // ==========================================
    // NORMALIZAÇÃO
    // ==========================================

    const normalizedMessage =
        message.trim();

    const phoneForWhatsapp =
        normalizePhoneForWhatsapp(phoneRaw);

    console.log(
        "[WEBHOOK] Mensagem normalizada:",
        normalizedMessage
    );

    console.log(
        "[WEBHOOK] Telefone normalizado:",
        phoneForWhatsapp
    );

    try {
        // ==========================================
        // DATA DE REFERÊNCIA
        // ==========================================
        //
        // A resposta recebida hoje sempre se refere
        // ao agendamento de AMANHÃ em Manaus.
        //
        // Exemplo:
        //
        // Hoje:      25/08/2026
        // Amanhã:    26/08/2026
        //
        // ==========================================

        const tomorrowManaus =
            getTomorrowManausDate();

        console.log(
            "[WEBHOOK] Data atual em Manaus:",
            getManausDate()
        );

        console.log(
            "[WEBHOOK] Data do agendamento:",
            tomorrowManaus
        );

        // ==========================================
        // 1️⃣ CONFIRMAR PRESENÇA
        // ==========================================

        if (
            ["1", "1️⃣"].includes(
                normalizedMessage
            )
        ) {
            console.log(
                "[WEBHOOK] 🟢 Usuário escolheu 1"
            );

            console.log(
                "[WEBHOOK] Data que será confirmada:",
                tomorrowManaus
            );

            console.log(
                "[WEBHOOK] Chamando confirmPresenceService..."
            );

            const result =
                await confirmPresenceService(
                    phoneForWhatsapp
                );

            console.log(
                "[WEBHOOK] Resultado confirmPresenceService:",
                result
            );

            console.log(
                "[WEBHOOK] Finalizando confirmação."
            );

            return res.sendStatus(200);
        }

        // ==========================================
        // 2️⃣ REAGENDAR
        // ==========================================

        if (
            ["2", "2️⃣"].includes(
                normalizedMessage
            )
        ) {
            console.log(
                "[WEBHOOK] 🔴 Usuário escolheu 2"
            );

            const calendarId =
                process.env.GOOGLE_CALENDAR_ID;

            if (!calendarId) {
                console.error(
                    "[WEBHOOK] ❌ GOOGLE_CALENDAR_ID não configurado"
                );

                return res.sendStatus(200);
            }

            // ==========================================
            // INTERVALO DO DIA DE AMANHÃ EM MANAUS
            // ==========================================

            const startOfDay =
                new Date(
                    `${tomorrowManaus}T00:00:00-04:00`
                );

            const endOfDay =
                new Date(
                    `${tomorrowManaus}T23:59:59.999-04:00`
                );

            console.log(
                "[WEBHOOK] Buscando eventos SOMENTE de:",
                tomorrowManaus
            );

            console.log(
                "[WEBHOOK] Início do período:",
                startOfDay.toISOString()
            );

            console.log(
                "[WEBHOOK] Fim do período:",
                endOfDay.toISOString()
            );

            // ==========================================
            // BUSCAR SOMENTE EVENTOS DE AMANHÃ
            // ==========================================

            const { data } =
                await calendar.events.list({
                    calendarId,

                    timeMin:
                        startOfDay.toISOString(),

                    timeMax:
                        endOfDay.toISOString(),

                    singleEvents: true,

                    orderBy: "startTime",

                    maxResults: 2500,
                });

            const events =
                data.items || [];

            console.log(
                "[WEBHOOK] Eventos encontrados para",
                tomorrowManaus,
                ":",
                events.length
            );

            // ==========================================
            // NORMALIZAÇÃO DO TELEFONE
            // ==========================================

            const phoneDigits =
                phoneForWhatsapp.replace(
                    /\D/g,
                    ""
                );

            const phoneWithoutCountryCode =
                phoneDigits.startsWith("55")
                    ? phoneDigits.slice(2)
                    : phoneDigits;

            console.log(
                "[WEBHOOK] Telefone completo:",
                phoneDigits
            );

            console.log(
                "[WEBHOOK] Telefone sem país:",
                phoneWithoutCountryCode
            );

            // ==========================================
            // PROCURAR O AGENDAMENTO
            // ==========================================
            //
            // O evento precisa obrigatoriamente:
            //
            // 1. Estar dentro do dia de amanhã
            // 2. Ter o telefone do paciente
            // 3. Estar como "Agendado"
            //
            // ==========================================

            const event =
                events.find((event) => {
                    const description =
                        event.description || "";

                    const descriptionDigits =
                        description.replace(
                            /\D/g,
                            ""
                        );

                    const hasPhone =
                        descriptionDigits.includes(
                            phoneDigits
                        ) ||
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

            // ==========================================
            // NENHUM AGENDAMENTO ENCONTRADO
            // ==========================================

            if (!event) {
                console.log(
                    "[WEBHOOK] ❌ Nenhum agendamento AGENDADO encontrado."
                );

                console.log(
                    "[WEBHOOK] Telefone:",
                    phoneForWhatsapp
                );

                console.log(
                    "[WEBHOOK] Data procurada:",
                    tomorrowManaus
                );

                return res.sendStatus(200);
            }

            // ==========================================
            // AGENDAMENTO ENCONTRADO
            // ==========================================

            console.log(
                "[WEBHOOK] ✅ Agendamento encontrado para reagendamento."
            );

            console.log(
                "[WEBHOOK] Event ID:",
                event.id
            );

            console.log(
                "[WEBHOOK] Título:",
                event.summary
            );

            console.log(
                "[WEBHOOK] Data:",
                event.start?.dateTime ||
                event.start?.date
            );

            const eventId =
                event.id;

            if (!eventId) {
                console.error(
                    "[WEBHOOK] ❌ Evento não possui ID."
                );

                return res.sendStatus(200);
            }

            // ==========================================
            // AVISAR O PACIENTE
            // ==========================================

            await sendConfirmedPresenceService({
                phone: phoneForWhatsapp,

                text:
                    "📅 Para reagendar um novo atendimento, acesse: https://dra.estefanyoliveira.com.br/",
            });

            console.log(
                "[WEBHOOK] Mensagem de reagendamento enviada."
            );

            // ==========================================
            // EXCLUIR O EVENTO ENCONTRADO
            // ==========================================

            await deleteAppointmentService(
                eventId
            );

            console.log(
                "[WEBHOOK] ✅ Evento excluído:",
                eventId
            );

            console.log(
                "[WEBHOOK] Data excluída:",
                tomorrowManaus
            );

            return res.sendStatus(200);
        }

        // ==========================================
        // OUTRA MENSAGEM
        // ==========================================

        console.log(
            "[WEBHOOK] Mensagem não reconhecida:",
            normalizedMessage
        );

        return res.sendStatus(200);

    } catch (error) {
        console.error(
            "[WEBHOOK] ❌ ERRO:",
            error
        );

        return res.sendStatus(500);
    }
};

export default evolutionWebhookController;