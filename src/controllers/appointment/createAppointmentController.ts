import { Request, Response } from "express";
import { createAppointmentServices } from "../../services/appointment/createAppointmentServices";

const createAppointmentController = async (req: Request, res: Response) => {
  const data = req.body;
  const Appointment = await createAppointmentServices(data);
  return res.status(201).json(Appointment);
};

export default createAppointmentController;
