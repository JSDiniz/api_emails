import { Request, Response } from "express";

import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";

import sendConfirmedPresenceService from "../../services/presence/sendConfirmedPresence.service";

import deleteAppointmentService from "../../services/appointment/deleteAppointment.service";

import confirmPresenceService from "../../services/presence/confirmPresence.service";

import { calendar } from "../../integrations/google/googleCalendar";

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

            /*
             * Busca o próximo agendamento desse telefone
             * diretamente no Google Calendar.
             */

            const now = new Date();

            const futureDate = new Date(now);

            futureDate.setDate(
                futureDate.getDate() + 90
            );

            console.log(
                "[WEBHOOK] Buscando próximo agendamento para reagendamento..."
            );

            const { data } =
                await calendar.events.list({
                    calendarId,

                    timeMin:
                        now.toISOString(),

                    timeMax:
                        futureDate.toISOString(),

                    singleEvents: true,

                    orderBy: "startTime",

                    maxResults: 2500,
                });

            const events =
                data.items || [];

            console.log(
                "[WEBHOOK] Eventos encontrados:",
                events.length
            );

            const phoneDigits =
                phoneForWhatsapp.replace(/\D/g, "");

            const phoneWithoutCountryCode =
                phoneDigits.startsWith("55")
                    ? phoneDigits.slice(2)
                    : phoneDigits;

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

                    /*
                     * Só podemos excluir um evento
                     * que ainda esteja Agendado.
                     */

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
                    "[WEBHOOK] ❌ Nenhum agendamento AGENDADO encontrado para reagendamento."
                );

                return res.sendStatus(200);
            }

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

            /*
             * Primeiro informa o paciente.
             */

            await sendConfirmedPresenceService({
                phone: phoneForWhatsapp,

                text:
                    "📅 Para reagendar um novo atendimento, acesse: https://dra.estefanyoliveira.com.br/",
            });

            console.log(
                "[WEBHOOK] Mensagem de reagendamento enviada."
            );

            /*
             * Agora exclui exatamente o evento
             * encontrado no Google Calendar.
             */

            await deleteAppointmentService(
                eventId
            );

            console.log(
                "[WEBHOOK] ✅ Evento excluído:",
                eventId
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