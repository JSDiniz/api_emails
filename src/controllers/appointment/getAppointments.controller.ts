import { Request, Response } from "express";
import getAppointmentsService from "../../services/appointment/getAppointments.service";

const getAppointmentsController = async (req: Request, res: Response) => {
  const calendarId = (req.query.calendarId as string) || "primary";
  const events = await getAppointmentsService(calendarId);
  return res.status(201).json(events);
};

export default getAppointmentsController;
