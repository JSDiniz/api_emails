export type DoctorAvailability = {
    city: string;
    availability: {
      date: string; // YYYY-MM-DD
      periods: {
        start: string;
        end: string;
      }[];
    }[];
  };
  