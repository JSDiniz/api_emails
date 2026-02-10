import { Request, Response } from "express";
import { getAllAvailabilityService } from "../../services/availability/availability.service";

export function availabilityController(req: Request, res: Response) {
  const data = getAllAvailabilityService();
  return res.json(data);
}
