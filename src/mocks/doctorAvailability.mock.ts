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

export const doctorAvailabilityMock: DoctorAvailability[] = [
  // ===== JANEIRO 2026 =====
  {
    city: "Manaus",
    availability: [
      // ===== JANEIRO 2026 =====
      { date: "2026-01-03", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-01-13", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-01-20", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-01-24", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-01-31", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== FEVEREIRO 2026 =====
      { date: "2026-02-17", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-02-21", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-02-24", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-02-28", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== MARÇO 2026 =====
      { date: "2026-03-10", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-17", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-21", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-03-24", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-28", periods: [{ start: "13:00", end: "17:00" }] },
    ],
  },
  {
    city: "Itacoatiara",
    availability: [
      // ===== JANEIRO 2026 =====
      { date: "2026-01-06", periods: [{ start: "15:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-01-07", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-01-08", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-01-09", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-01-10", periods: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },

      // ===== FEVEREIRO 2026 =====
      { date: "2026-02-03", periods: [{ start: "15:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-02-04", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-02-05", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-02-06", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-02-07", periods: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },

      // ===== MARÇO 2026 =====
      { date: "2026-03-03", periods: [{ start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-03-04", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-03-05", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-03-06", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-03-07", periods: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
    ],
  },
];
