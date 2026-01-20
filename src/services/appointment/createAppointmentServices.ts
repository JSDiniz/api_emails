import "dotenv/config";
import { calendar } from "../../integrations/google/googleCalendar";
import { sendEmailToDoctor, sendEmailToPatient } from "../email/emailService";
import { FormData } from "../../types/appointmentTypes"

const REMINDER_MINUTES = 60 * 24;

// Define cores por cidade
const cityColors: Record<string, string> = {
  Manaus: "1",
  Itacoatiara: "11",
};

export async function createAppointmentServices(data: FormData) {
  const { name, email, phone, clinic, service, date, time, message, startDate, endDate } = data;

  // Cor do evento baseada na cidade
  const eventColor = clinic?.city ? cityColors[clinic.city] || "2" : "2";

  // 1️⃣ Criar evento no Google Calendar
  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID as string,
    requestBody: {
      summary: `${name} - ${service}`,
      description: `
        Paciente: ${name}
        Serviço: ${service}
        Email: ${email}
        Cidade: ${clinic.city} - ${clinic.state}
        Endereço: ${clinic.street}, ${clinic.number} - ${clinic.neighborhood}
        CEP: ${clinic.zip}
        Telefone: ${phone}
        Mensagem: ${message || "-"}
        `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Manaus",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Manaus",
      },

      // ✅ aqui você define a cor do evento
      colorId: eventColor,
      // ✅ AQUI está a correção
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: REMINDER_MINUTES },
          { method: "popup", minutes: REMINDER_MINUTES },
        ],
      },
    },
  });

  // 2️⃣ Email para o doutor
  await sendEmailToDoctor(data);

  // 3️⃣ Email para o paciente (somente se existir email)
  if (email && email.trim() !== "") {
    await sendEmailToPatient(data);
  }

  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  let finalMessage = `Agendamento realizado com sucesso para ${name} no endereço ${clinic.street}, ${clinic.number} - ${clinic.neighborhood}, ${clinic.city} - ${clinic.state}, ${clinic.zip}. Serviço: ${service} Data: ${formattedDate} às ${time}.`;

  if (email && email.trim() !== "") {
    finalMessage += `\nVocê receberá um e-mail com todas as informações do agendamento.`;
  }

  return {
    message: finalMessage,
  };
}
