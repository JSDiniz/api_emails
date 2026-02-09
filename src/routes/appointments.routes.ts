import { Router } from "express";
import getAppointmentsController from "../controllers/appointment/getAppointments.controllers";
import createAppointmentController from "../controllers/appointment/createAppointment.controllers";
import deleteAppointmentsController from "../controllers/appointment/deleteAppointments.controllers";
import checkDoctorAvailabilityMiddleware from "../middlewares/checkDoctorAvailabilityMiddleware";
import confirmScheduledController from "../controllers/appointment/confirmScheduled.controllers";


const appointmentsRoutes = Router();

appointmentsRoutes.post("/", checkDoctorAvailabilityMiddleware, createAppointmentController);
appointmentsRoutes.get("/", getAppointmentsController);
appointmentsRoutes.post("/confirm-scheduled", confirmScheduledController);
appointmentsRoutes.delete("/:idEvent", deleteAppointmentsController);

export default appointmentsRoutes;
