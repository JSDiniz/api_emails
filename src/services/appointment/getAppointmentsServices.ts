import { calendar } from "../../integrations/google/googleCalendar";

export const getAppointmentsServices = async (calendarId) => {
  const { data } = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 20,
  });

  const events = data.items?.map((event) => ({
    id: event.id,
    title: event.summary,
    description: event.description,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
  }));

  return events;
};
