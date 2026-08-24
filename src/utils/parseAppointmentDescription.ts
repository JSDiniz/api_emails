const parseAppointmentDescription = (description: string) => {
    const getValue = (field: string) => {
        const match = description.match(
            new RegExp(`${field}:\\s*(.*)`)
        );

        return match ? match[1].trim() : "";
    };

    return {
        paciente: getValue("Paciente"),
        service: getValue("Serviço"),
        street: getValue("Endereço"),
        city: getValue("Cidade"),
        cep: getValue("CEP"),
        phone: getValue("Telefone"),
        status: getValue("Status") || "Agendado",
    };
};

export default parseAppointmentDescription;