import "dotenv/config";
import { doctorAvailabilityMock } from "../../mocks/doctorAvailability.mock";
import sendConfirmedPresenceService from "./sendConfirmedPresence.service";
import { calendar } from "../../integrations/google/googleCalendar";
import { presenceStore } from "../../store/presence.store";
import { sleep } from "../../utils/async";

const calendarId = process.env.GOOGLE_CALENDAR_ID;

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
        console.log("Doutora não atende amanhã.");
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

        // ✅ Verificar status primeiro
        const statusMatch = desc.match(/Status:\s*(.*)/);
        const status = statusMatch ? statusMatch[1].trim() : "Agendado";

        if (status === "Confirmado") {
            console.log(`Evento ${event.id} já está confirmado, pulando envio de mensagem.`);
            continue; // não envia mensagem
        }

        const formattedDate = new Date(dateStr).toLocaleDateString("pt-BR");

        // Extrair dados do description usando regex
        const pacienteMatch = desc.match(/Paciente:\s*(.*)/);
        const serviceMatch = desc.match(/Serviço:\s*(.*)/);
        const streetMatch = desc.match(/Endereço:\s*(.*)/);
        const cityMatch = desc.match(/Cidade:\s*(.*)/);
        const cepMatch = desc.match(/CEP:\s*(.*)/);
        const telefoneMatch = desc.match(/Telefone:\s*(.*)/);

        if (!telefoneMatch) continue; // se não tiver telefone, pula

        const paciente = pacienteMatch ? pacienteMatch[1].trim() : '';
        const service = serviceMatch ? serviceMatch[1].trim() : '';
        const street = streetMatch ? streetMatch[1].trim() : '';
        const city = cityMatch ? cityMatch[1].trim() : '';
        const cep = cepMatch ? cepMatch[1].trim() : '';
        const phone = telefoneMatch[1].trim();

        // Pegar horário do evento
        const startTime = event.start?.dateTime || event.start?.date;
        const formattedTime = startTime
            ? new Date(startTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Manaus",
            })
            : "";
        // usar o id do evento como referência única
        const appointmentId = event.id;

        const normalizedPhone = phone.replace(/\D/g, "");
        const finalPhone = normalizedPhone.startsWith("55")
            ? normalizedPhone
            : `55${normalizedPhone}`;

        // Salvar no presenceStore
        presenceStore.push({
            id: appointmentId,
            phone: finalPhone,
        });
        // Montar mensagem
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

        sentCount++; // incrementa apenas quando envia mensagem
        await sleep(2000);
    }

    console.log(`Mensagens enviadas para ${sentCount} pacientes.`);
}

export default sendPresenceService