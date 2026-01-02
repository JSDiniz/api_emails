import { Request, Response } from "express";
import { deleteAppointmentsServices } from "../../services/appointment/deleteAppointmentsServices";

const deleteAppointmentsController = async (req: Request, res: Response) => {
  const { calendarId, eventId } = req.params;

  if (!calendarId || !eventId) {
    return res.status(400).json({
      message: "calendarId e eventId são obrigatórios",
    });
  }

  const events = await deleteAppointmentsServices(calendarId as string, eventId as string);
  return res.status(200).json(events);
};

export default deleteAppointmentsController;
