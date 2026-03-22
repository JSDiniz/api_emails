export type DoctorAvailability = {
  city: string;
  availability: {
    date: string;
    periods: {
      start: string;
      end: string;
    }[];
  }[];
};
