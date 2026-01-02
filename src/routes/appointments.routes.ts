import { Router } from "express";
import getAppointmentsController from "../controllers/appointment/getAppointmentsController";
import createAppointmentController from "../controllers/appointment/createAppointmentController";
import deleteAppointmentsController from "../controllers/appointment/deleteAppointmentsController";

const appointmentsRoutes = Router();

appointmentsRoutes.post("/", createAppointmentController);
appointmentsRoutes.get("/", getAppointmentsController);
appointmentsRoutes.delete("/:calendarId/:eventId", deleteAppointmentsController);

export default appointmentsRoutes;
