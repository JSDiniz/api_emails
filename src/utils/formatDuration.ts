export function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (hours === 0) return `${minutes} minutos`;
    if (rest === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;

    return `${hours}h ${rest}min`;
}

export function parseDateManaus(date: string, time: string) {
    const [hours, minutes] = time.split(':').map(Number);

    // Cria o Date usando Date.UTC e ajusta para Manaus (UTC-4)
    const d = new Date(Date.UTC(
        Number(date.split('-')[0]),       // ano
        Number(date.split('-')[1]) - 1,   // mês (0-index)
        Number(date.split('-')[2]),       // dia
        hours + 4,                        // ajusta para UTC (+4)
        minutes
    ));
    return d;
}


