export function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (hours === 0) return `${minutes} minutos`;
    if (rest === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;

    return `${hours}h ${rest}min`;
}