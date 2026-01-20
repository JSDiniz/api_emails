import { doctorAvailabilityMock } from "../mocks/doctorAvailability.mock";
import { parseDateManaus } from "./formatDuration";

export function isWithinDoctorAvailability(params: {
    city: string;
    date: string;
    startDate: Date;
    endDate: Date;
}): boolean {
    const { city, date, startDate, endDate } = params;

    const cityAvailability = doctorAvailabilityMock.find(
        (item) => item.city === city
    );

    if (!cityAvailability) return false;

    const dayAvailability = cityAvailability.availability.find(
        (item) => item.date === date
    );

    if (!dayAvailability) return false;

    // 🔹 Verifica se o intervalo inteiro está dentro de algum período
    return dayAvailability.periods.some((period) => {
        // Cria datas ajustadas para Manaus
        const periodStart = parseDateManaus(date, period.start);
        const periodEnd = parseDateManaus(date, period.end);

        // ✅ O agendamento deve começar **depois ou igual ao início** e terminar **antes ou igual ao fim**
        return startDate >= periodStart && endDate <= periodEnd;
    });
}
