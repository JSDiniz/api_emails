import { calendar } from "../../integrations/google/googleCalendar";
import { parseGoogleEvent } from "../../utils/parseGoogleEvent";
import { sendCancellationEmailToDoctor } from "../email/emailService";

export const deleteAppointmentsServices = async (
  calendarId: string,
  eventId: string
) => {
  // 1. Buscar o evento
  const event = await calendar.events.get({
    calendarId,
    eventId,
  });

  if (!event.data) {
    throw new Error("Evento não encontrado");
  }

  // 2. Parse dos dados
  const parsedEvent = parseGoogleEvent(event.data);

  // 3. Deletar evento
  await calendar.events.delete({
    calendarId,
    eventId,
  });

  // 4. Enviar email
  await sendCancellationEmailToDoctor(parsedEvent);

  return {
    message: `Evento ${eventId} deletado com sucesso`,
  };
};
