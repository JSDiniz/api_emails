import { Router } from "express";
import getAppointmentsController from "../controllers/appointment/getAppointmentsController";
import createAppointmentController from "../controllers/appointment/createAppointmentController";

const appointmentsRoutes = Router();

appointmentsRoutes.post("/", createAppointmentController);
appointmentsRoutes.get("/", getAppointmentsController);

export default appointmentsRoutes;
