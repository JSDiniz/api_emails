// src/modules/availability/availability.service.ts

import { doctorAvailabilityMock } from "../../mocks/doctorAvailability.mock";
import { DoctorAvailability } from "../../types/availabilityTypes";


export function getAllAvailability(): DoctorAvailability[] {
  return doctorAvailabilityMock;
}
