import "dotenv/config";
import { calendar } from "../../integrations/google/googleCalendar";

const calendarId = process.env.GOOGLE_CALENDAR_ID;

export async function deleteAppointmentServices(idEvent: string) {

  await calendar.events.delete({
    calendarId,
    eventId: idEvent
  });

  return {
    message: "deletado com sucesso",
  };
}
