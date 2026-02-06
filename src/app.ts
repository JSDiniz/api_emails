import express, { Application } from "express";
import cors from "cors";
import cron from "node-cron";
import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";
import handleError from "./errors/handleError";
import whatsappRoutes from "./routes/whatsapp.routes";
import { sendPresenceServices } from "./services/presence/sendPresence.services";
import cronRoutes from "./routes/cron.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/whatsapp", whatsappRoutes)
app.use("/api", cronRoutes);

app.use(handleError);

export default app;