import "dotenv/config";
import { doctorAvailabilityMock } from "../../mocks/doctorAvailability.mock";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";
import { calendar } from "../../integrations/google/googleCalendar";
import { presenceStore } from "../../store/presence.store";
import { sleep } from "../../utils/async";
import sendConfirmationSchedulingService from "../whatsapp/sendConfirmationScheduling.service";

const calendarId = process.env.GOOGLE_CALENDAR_ID;
const doctorName = process.env.DOCTOR_NAME;

const sendPresenceService = async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const availableDay = doctorAvailabilityMock
        .flatMap(city =>
            city.availability
                .filter(day => day.date === dateStr)
                .map(day => ({ city: city.city, ...day }))
        )[0];


    if (!availableDay) {
        return;
    }

    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    const { data } = await calendar.events.list({
        calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
    });

    const events = data.items || [];

    let sentCount = 0;

    for (const event of events) {
        const desc = event.description;
        if (!desc) continue;

        const statusMatch = desc.match(/Status:\s*(.*)/);
        const status = statusMatch ? statusMatch[1].trim() : "Agendado";

        if (status === "Confirmado") {
            console.log(`Evento ${event.id} já está confirmado, pulando envio de mensagem.`);
            continue;
        }

        const formattedDate = new Date(`${dateStr}T12:00:00`).toLocaleDateString(
            "pt-BR",
            { timeZone: "America/Manaus" }
        );

        const pacienteMatch = desc.match(/Paciente:\s*(.*)/);
        const serviceMatch = desc.match(/Serviço:\s*(.*)/);
        const streetMatch = desc.match(/Endereço:\s*(.*)/);
        const cityMatch = desc.match(/Cidade:\s*(.*)/);
        const cepMatch = desc.match(/CEP:\s*(.*)/);
        const telefoneMatch = desc.match(/Telefone:\s*(.*)/);

        if (!telefoneMatch) continue;

        const paciente = pacienteMatch ? pacienteMatch[1].trim() : '';
        const service = serviceMatch ? serviceMatch[1].trim() : '';
        const street = streetMatch ? streetMatch[1].trim() : '';
        const city = cityMatch ? cityMatch[1].trim() : '';
        const cep = cepMatch ? cepMatch[1].trim() : '';
        const phone = telefoneMatch[1].trim();

        const startTime = event.start?.dateTime || event.start?.date;
        const formattedTime = startTime
            ? new Date(startTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Manaus",
            })
            : "";

        const appointmentId = event.id;

        const normalizedPhone = phone.replace(/\D/g, "");
        const finalPhone = normalizedPhone.startsWith("55") ? normalizedPhone : `55${normalizedPhone}`;

        const exists = presenceStore.some(
            p => p.phone === finalPhone && p.id === appointmentId
        );

        if (!exists) {
            // Salvar no presenceStore
            // presenceStore.push({
            //     id: appointmentId,
            //     phone: finalPhone,
            //     date: formattedDate,
            //     time: formattedTime,
            //     status: "pending"
            // });

            presenceStore.push({
                id: appointmentId,
                phone: finalPhone,
            });
        }

        const whatsappMessage = `Confirmação de presença 🦷
    
    📍 Local:
    ${street}
    ${city}
    CEP: ${cep}
    
    🦷 Serviço: ${service}
    📅 Data: ${formattedDate}
    ⏰ Horário: ${formattedTime}
    
    Responda com:
    1️⃣ Confirmar presença
    2️⃣ Não poderei ir
    `;

        await sendConfirmedPresenceService({
            phone,
            text: whatsappMessage,
        });


        // const local = `${street}, ${city}, ${cep}`

        // await sendConfirmationSchedulingService(normalizedPhone, paciente, doctorName, formattedDate, formattedTime, local)

        sentCount++;
        await sleep(2000);
    }
}

export default sendPresenceService