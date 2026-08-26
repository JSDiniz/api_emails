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
      { date: "2026-02-10", periods: [{ start: "08:00", end: "12:00" }] },
      // { date: "2026-02-17", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-02-21", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-02-24", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-02-28", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== MARÇO 2026 =====
      { date: "2026-03-10", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-17", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-21", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-03-24", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-03-28", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== ABRIL 2026 =====
      { date: "2026-04-04", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-04-14", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-04-25", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-04-28", periods: [{ start: "08:00", end: "12:00" }] },

      // ===== MAIO 2026 =====
      { date: "2026-05-02", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-05-12", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-05-23", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-05-26", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-05-30", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== JUNHO 2026 =====
      { date: "2026-06-20", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-06-23", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-06-27", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-06-30", periods: [{ start: "08:00", end: "12:00" }] },

      // ===== JULHO 2026 =====
      { date: "2026-07-04", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-07-21", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-07-25", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-07-28", periods: [{ start: "08:00", end: "12:00" }] },

      // ===== AGOSTO 2026 =====
      { date: "2026-08-01", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-08-18", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-08-22", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-08-25", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-08-27", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-08-28", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-08-29", periods: [{ start: "13:00", end: "17:00" }] },


      // ===== SETEMBRO 2026 =====
      { date: "2026-09-19", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-09-22", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-09-26", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-09-29", periods: [{ start: "08:00", end: "12:00" }] },

      // ===== OUTUBRO 2026 =====
      { date: "2026-10-03", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-10-20", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-10-24", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-10-27", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-10-31", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== NOVEMBRO 2026 =====
      { date: "2026-11-17", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-11-21", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-11-24", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-11-28", periods: [{ start: "13:00", end: "17:00" }] },

      // ===== NOVEMBRO 2026 =====
      { date: "2026-12-19", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-12-22", periods: [{ start: "08:00", end: "12:00" }] },
      { date: "2026-12-26", periods: [{ start: "13:00", end: "17:00" }] },
      { date: "2026-12-29", periods: [{ start: "08:00", end: "12:00" }] },
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

      // ===== ABRIL 2026 =====
      { date: "2026-04-06", periods: [{ start: "14:00", end: "18:00" }] },
      { date: "2026-04-07", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-04-08", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-04-09", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-04-10", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-04-11", periods: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },

      // ===== MAIO 2026 =====
      { date: "2026-05-04", periods: [{ start: "14:00", end: "18:00" }] },
      { date: "2026-05-05", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-05-06", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-05-07", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-05-08", periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }, { start: "17:30", end: "20:30" }] },
      { date: "2026-05-09", periods: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },

      // ===== JUNHO 2026 =====
      { date: "2026-06-01", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-06-02", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-06-03", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-06-04", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-06-05", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== JULHO 2026 =====
      { date: "2026-07-06", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-07-07", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-07-08", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-07-09", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-07-10", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-07-11", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== AGOSTO 2026 =====
      { date: "2026-08-03", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-08-04", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-08-05", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-08-06", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-08-07", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-08-08", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== SETEMBRO 2026 =====
      { date: "2026-09-01", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-09-02", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-09-03", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-09-04", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-09-05", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== OUTUBRO 2026 =====
      { date: "2026-10-06", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-10-07", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-10-08", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-10-09", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-10-10", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== NOVEMBRO 2026 =====
      { date: "2026-11-03", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-11-04", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-11-05", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-11-06", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-11-07", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },

      // ===== DEZEMBRO 2026 =====
      { date: "2026-12-01", periods: [{ start: "15:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-12-02", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-12-03", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-12-04", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
      { date: "2026-12-05", periods: [{ start: "09:00", end: "12:00" }, { start: "13:20", end: "18:20" }, { start: "19:00", end: "20:40" }] },
    ],
  },
];
