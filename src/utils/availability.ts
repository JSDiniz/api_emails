import { doctorAvailabilityMock } from "../mocks/doctorAvailability.mock";

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
        const periodStart = new Date(`${date}T${period.start}:00`);
        const periodEnd = new Date(`${date}T${period.end}:00`);

        return startDate >= periodStart && endDate <= periodEnd;
    });
}