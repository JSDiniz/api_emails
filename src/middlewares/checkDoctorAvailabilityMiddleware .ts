import { Request, Response, NextFunction } from "express";
import { isWithinDoctorAvailability } from "../utils/availability";
import { calendar } from "../integrations/google/googleCalendar";
import { serviceDurations } from "../mocks/serviceDurations.mock";
import { AppError } from "../errors/AppError";
import { formatDuration } from "../utils/formatDuration";

const checkDoctorAvailabilityMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const { clinic, service, date, time } = req.body;

    // 🔹 Normaliza o serviço (garante match com o objeto)
    const normalizedService = service.toLowerCase().trim();

    // 🔹 Duração do serviço
    const durationInMinutes = serviceDurations[normalizedService] || 30;

    const formattedDuration = formatDuration(durationInMinutes);

    // 🔹 Datas como Date (regra de ouro)
    const startDate = new Date(`${date}T${time}:00`);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationInMinutes);

    const isAvailableInDoctorAgenda = isWithinDoctorAvailability({
        city: clinic.city,
        date,
        startDate,
        endDate,
    });

    if (!isAvailableInDoctorAgenda) {
        throw new AppError(
            `Horário indisponível. O serviço selecionado possui duração de ${formattedDuration} e ultrapassa o horário disponível da doutora. Por favor, selecione outra data ou horário disponível.`,
            409
        );
    }

    // 🔍 Verifica conflito no Google Calendar
    const events = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID as string,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
    });

    if (events.data.items && events.data.items.length > 0) {
        throw new AppError(
            `Horário indisponível. O serviço selecionado possui duração de ${formattedDuration} e ultrapassa o horário disponível da doutora. Por favor, selecione outra data ou horário disponível.`,
            409
        );
    }

    // 6️⃣ Compartilha dados com o controller
    req.body.startDate = startDate;
    req.body.endDate = endDate;

    return next();

};

export default checkDoctorAvailabilityMiddleware;