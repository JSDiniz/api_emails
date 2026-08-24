interface PresenceMessageParams {
    street: string;
    city: string;
    cep: string;
    service: string;
    date: string;
    time: string;
}

const buildPresenceMessage = ({
    street,
    city,
    cep,
    service,
    date,
    time,
}: PresenceMessageParams) => {
    return `
        Confirmação de presença 🦷

        📍 Local: ${street}, ${city} - CEP ${cep}

        🦷 Serviço: ${service}
        📅 Data: ${date}
        ⏰ Horário: ${time}
        Responda com:

        1️⃣ Confirmar presença

        2️⃣ Reagendar atendimento
    `;
};

export default buildPresenceMessage;