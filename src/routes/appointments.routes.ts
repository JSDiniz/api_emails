import { Router } from "express";
import getAppointmentsController from "../controllers/appointment/getAppointmentsController";
import createAppointmentController from "../controllers/appointment/createAppointmentController";
import deleteAppointmentsController from "../controllers/appointment/deleteAppointmentsController";
import checkDoctorAvailabilityMiddleware from "../middlewares/checkDoctorAvailabilityMiddleware ";

const appointmentsRoutes = Router();

appointmentsRoutes.post("/", checkDoctorAvailabilityMiddleware, createAppointmentController);
appointmentsRoutes.get("/", getAppointmentsController);
appointmentsRoutes.delete("/:calendarId/:eventId", deleteAppointmentsController);

export default appointmentsRoutes;
