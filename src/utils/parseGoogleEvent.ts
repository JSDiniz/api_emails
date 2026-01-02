export function parseGoogleEvent(event: any) {
    const description = event.description || "";
  
    const getValue = (label: string) => {
      const regex = new RegExp(`${label}:\\s*(.*)`);
      const match = description.match(regex);
      return match ? match[1].trim() : "";
    };
  
    const dateTime = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : null;
  
    return {
      name: getValue("Paciente"),
      service: getValue("Serviço"),
      email: getValue("Email"),
      city: getValue("Cidade"),
      address: getValue("Endereço"),
      cep: getValue("CEP"),
      phone: getValue("Telefone"),
      message: getValue("Mensagem"),
      date: dateTime?.toLocaleDateString("pt-BR"),
      time: dateTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }
  