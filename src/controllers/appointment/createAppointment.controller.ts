import { Request, Response } from "express";
import createAppointmentService from "../../services/appointment/createAppointment.service";

const createAppointmentController = async (req: Request, res: Response) => {
  const data = req.body;
  const Appointment = await createAppointmentService(data);
  return res.status(201).json(Appointment);
};

export default createAppointmentController;
