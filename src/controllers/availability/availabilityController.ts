// src/modules/availability/availability.controller.ts

import { Request, Response } from "express";
import { getAllAvailability } from "../../services/availability/availabilityService";

export function availabilityController(req: Request, res: Response) {
  const data = getAllAvailability();
  return res.json(data);
}
