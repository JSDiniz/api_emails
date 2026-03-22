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

    return dayAvailability.periods.some((period) => {
        const periodStart = parseDateManaus(date, period.start);
        const periodEnd = parseDateManaus(date, period.end);

        return startDate >= periodStart && endDate <= periodEnd;
    });
}
