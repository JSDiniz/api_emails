import "dotenv/config";
import { FormData } from "../../types/appointmentTypes"
import { calendar } from "../../integrations/google/googleCalendar";
import createWhatsappService from "../whatsapp/createWhatsapp.service";
import { sendEmailToDoctor, sendEmailToPatient } from "../email/email.services";

const SEND_WHATSAPP = process.env.SEND_WHATSAPP === "true";

const REMINDER_MINUTES = 60 * 24;

// Define cores por cidade
const cityColors: Record<string, string> = {
  Manaus: "1",
  Itacoatiara: "11",
};

const createAppointmentService = async (data: FormData) => {
  const { name, email, phone, clinic, service, date, time, message, startDate, endDate } = data;

  // Cor do evento baseada na cidade
  const eventColor = clinic?.city ? cityColors[clinic.city] || "2" : "2";

  // Criar evento no Google Calendar
  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID as string,
    requestBody: {
      summary: `${name} - ${service}`,
      description: `
        Status: Agendado
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

      colorId: eventColor,

      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: REMINDER_MINUTES },
          { method: "popup", minutes: REMINDER_MINUTES },
        ],
      },
      extendedProperties: {
        private: {
          status: "agendado",
          appointmentId: `${phone}123`,
        },
      },
    },
  });

  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString(
    "pt-BR",
    { timeZone: "America/Manaus" }
  );

  const address = `${clinic.street}, ${clinic.number}, ${clinic.neighborhood}, ${clinic.city} - ${clinic.state} - CEP ${clinic.zip}`;

  const whatsappMessage = `Agendamento confirmado ✅

  🦷 Serviço: ${service}
  📅 Data: ${formattedDate}
  ⏰ Horário: ${time}

  📍 Local: ${address}

  🗺️ Como chegar: ${clinic.googleMapsUrl}
  `;

  if (SEND_WHATSAPP) {
    try {
      //Evolution
      await createWhatsappService({
        phone,
        message: whatsappMessage,
      });

      //WhatsApp Oficial
      // const local = `${clinic.street}, ${clinic.number}, ${clinic.neighborhood}, ${clinic.city} - ${clinic.state}, ${clinic.zip}`
      // await sendAppointmentConfirmationService(phone, name, formattedDate, time, local)
    } catch (err) {
      console.error("Erro ao enviar WhatsApp:", err);
    }
  }

  await sendEmailToDoctor(data);

  if (email && email.trim() !== "") {
    await sendEmailToPatient(data);
  }

  let finalMessage = `Agendamento realizado com sucesso para ${name} no endereço ${clinic.street}, ${clinic.number} - ${clinic.neighborhood}, ${clinic.city} - ${clinic.state}, ${clinic.zip}. Serviço: ${service} Data: ${formattedDate} às ${time}.`;

  if (email && email.trim() !== "") {
    finalMessage += `\nVocê receberá um e-mail com todas as informações do agendamento.`;
  }

  return {
    message: finalMessage,
  };
}


export default createAppointmentService