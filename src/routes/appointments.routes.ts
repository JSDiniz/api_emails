import { Router } from "express";
import getAppointmentsController from "../controllers/appointment/getAppointments.controller";
import confirmScheduledController from "../controllers/appointment/confirmScheduled.controller";
import checkDoctorAvailabilityMiddleware from "../middlewares/checkDoctorAvailabilityMiddleware";
import createAppointmentController from "../controllers/appointment/createAppointment.controller";
import deleteAppointmentsController from "../controllers/appointment/deleteAppointments.controller";


const appointmentsRoutes = Router();

appointmentsRoutes.post("/", checkDoctorAvailabilityMiddleware, createAppointmentController);
appointmentsRoutes.get("/", getAppointmentsController);
appointmentsRoutes.get("/confirm-scheduled", confirmScheduledController);
appointmentsRoutes.delete("/:idEvent", deleteAppointmentsController);

export default appointmentsRoutes;
