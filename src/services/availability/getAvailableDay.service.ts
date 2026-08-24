import { doctorAvailabilityMock } from "../../mocks/doctorAvailability.mock";

const getAvailableDayService = (date: string) => {
    return doctorAvailabilityMock
        .flatMap(city =>
            city.availability
                .filter(day => day.date === date)
                .map(day => ({
                    city: city.city,
                    ...day,
                }))
        )[0];
};

export default getAvailableDayService;