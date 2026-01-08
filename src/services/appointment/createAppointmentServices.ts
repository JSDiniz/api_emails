import "dotenv/config";
import { calendar } from "../../integrations/google/googleCalendar";
import { parseAddress } from "../../utils/parseAddress";
import { sendEmailToDoctor, sendEmailToPatient } from "../email/emailService";

const REMINDER_MINUTES = 60 * 24;

export async function createAppointmentServices(data) {
  const { name, email, phone, city, service, date, time, message } = data;

  const { enderecoRua, cidade, estado, cep } = parseAddress(city);

  // 🔹 Start no formato LOCAL
  const startDateTime = `${date}T${time}:00`;

  // 🔹 End +30 minutos
  const endDate = new Date(`${date}T${time}:00`);
  endDate.setMinutes(endDate.getMinutes() + 30);

  const endDateTime = endDate
    .toLocaleString("sv-SE") // YYYY-MM-DD HH:mm:ss
    .replace(" ", "T");

  // 1️⃣ Criar evento no Google Calendar
  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID as string,
    requestBody: {
      summary: `Consulta - ${name}`,
      description: `
        Paciente: ${name}
        Serviço: ${service}
        Email: ${email}
        Cidade: ${cidade} - ${estado}</p>
        Endereço: ${enderecoRua}</p>
        CEP: ${cep}</p>
        Telefone: ${phone}
        Mensagem: ${message || "-"}
        `,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Manaus",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Manaus",
      },

      // ✅ AQUI está a correção
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: "email",
            minutes:  REMINDER_MINUTES, // 24 horas
          },
          {
            method: "popup",
            minutes:  REMINDER_MINUTES, // 24 horas
          },
        ],
      },
    },
  });

  // 2️⃣ Email para o doutor
  await sendEmailToDoctor({ name, service, city, date, time });

  // 3️⃣ Email para o paciente
  await sendEmailToPatient({ email, service, city, date, time });

  return {
    message: `Agendamento realizado com sucesso para ${name} no endereço ${city}.\nServiço: ${service}\nData: ${date} às ${time}.\nVocê receberá um e-mail com todas as informações do agendamento.`,
  };
}
