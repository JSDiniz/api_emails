import { calendar } from "../../integrations/google/googleCalendar";

const calendarId = process.env.GOOGLE_CALENDAR_ID;

const getAppointmentsByDateService = async (date: string) => {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const { data } = await calendar.events.list({
        calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
    });

    return data.items || [];
};

export default getAppointmentsByDateService;