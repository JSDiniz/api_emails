
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

    const date = getTomorrowDate();

    const availableDay = getAvailableDayService(date);

    if (!availableDay) {
        console.log(
            `[CRON] Não existe disponibilidade para ${date}.`
        );

        return;
    }

    const events = await getAppointmentsByDateService(date);

    for (const event of events) {

        if (!event.description) {
            continue;
        }

        const appointment = parseAppointmentDescription(
            event.description
        );

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

        registerPresenceService({
            id: event.id!,
            phone,
            date: formattedDate,
            time: formattedTime,
        });

        const message = buildPresenceMessage({
            street: appointment.street,
            city: appointment.city,
            cep: appointment.cep,
            service: appointment.service,
            date: formattedDate,
            time: formattedTime,
        });

        await sendConfirmedPresenceService({
            phone: appointment.phone,
            text: message,
        });

        await sleep(2000);
    }
};

export default sendPresenceService;