
import getAvailableDayService from "../availability/getAvailableDay.service";
import getAppointmentsByDateService from "../calendar/getAppointmentsByDate.service";

import registerPresenceService from "./registerPresence.service";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";

import { sleep } from "../../utils/async";
import getTomorrowDate from "../../utils/getTomorrowDate";
import { ensureBrazilCountryCode } from "../../utils/phone.utils";
import buildPresenceMessage from "../../utils/buildPresenceMessage";
import parseAppointmentDescription from "../../utils/parseAppointmentDescription";

const sendPresenceService = async () => {

    console.log("========== [CRON] INÍCIO ==========");

    const date = getTomorrowDate();

    console.log("[CRON] Data de amanhã:", date);

    const availableDay = getAvailableDayService(date);

    console.log("[CRON] Disponibilidade encontrada:", availableDay);

    if (!availableDay) {
        console.log(
            `[CRON] Não existe disponibilidade para ${date}.`
        );

        return;
    }

    const events = await getAppointmentsByDateService(date);

    console.log("[CRON] Eventos encontrados:", events.length);
    console.log(
        "[CRON] IDs dos eventos:",
        events.map(event => event.id)
    );

    for (const event of events) {

        console.log("--------------------------------");
        console.log("[CRON] Processando evento:", event.id);

        if (!event.description) {
            continue;
        }

        const appointment = parseAppointmentDescription(
            event.description
        );

        console.log("[CRON] Appointment:", appointment);

        if (appointment.status === "Confirmado") {
            console.log(
                `Evento ${event.id} já está confirmado.`
            );

            continue;
        }

        if (!appointment.phone) {
            continue;
        }

        const startTime =
            event.start?.dateTime ||
            event.start?.date;

        const formattedDate = new Date(
            `${date}T12:00:00`
        ).toLocaleDateString("pt-BR", {
            timeZone: "America/Manaus",
        });

        const formattedTime = startTime
            ? new Date(startTime).toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Manaus",
                }
            )
            : "";

        const phone = ensureBrazilCountryCode(appointment.phone);

        console.log("[CRON] Telefone original:", appointment.phone);
        console.log("[CRON] Telefone normalizado:", phone);
        console.log("[CRON] Data:", formattedDate);
        console.log("[CRON] Horário:", formattedTime);

        registerPresenceService({
            id: event.id!,
            phone,
            date: formattedDate,
            time: formattedTime,
        });

        console.log(
            "[CRON] Presence registrada para evento:",
            event.id
        );

        const message = buildPresenceMessage({
            street: appointment.street,
            city: appointment.city,
            cep: appointment.cep,
            service: appointment.service,
            date: formattedDate,
            time: formattedTime,
        });

        console.log("[CRON] Enviando WhatsApp...");

        await sendConfirmedPresenceService({
            phone: appointment.phone,
            text: message,
        });

        console.log("[CRON] WhatsApp enviado.");

        await sleep(2000);
    }

    console.log("========== [CRON] FIM ==========");
};

export default sendPresenceService;