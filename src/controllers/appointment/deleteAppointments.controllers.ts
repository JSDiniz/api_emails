import { Request, Response } from "express";
import { deleteAppointmentServices } from "../../services/appointment/deleteAppointment.services";

const deleteAppointmentsController = async (req: Request, res: Response) => {
  const { idEvent } = req.params;

  if (!idEvent) {
    return res.status(400).json({
      message: "Id do evento são obrigatórios",
    });
  }

  const events = await deleteAppointmentServices(idEvent);
  return res.status(200).json(events);
};

export default deleteAppointmentsController;
