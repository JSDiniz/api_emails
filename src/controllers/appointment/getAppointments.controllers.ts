import { Request, Response } from "express";
import { getAppointmentsServices } from "../../services/appointment/getAppointments.services";

const getAppointmentsController = async (req: Request, res: Response) => {
  const calendarId = (req.query.calendarId as string) || "primary";
  const events = await getAppointmentsServices(calendarId);
  return res.status(201).json(events);
};

export default getAppointmentsController;
