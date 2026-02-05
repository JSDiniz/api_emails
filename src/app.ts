import express, { Application } from "express";
import cors from "cors";
import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";
import handleError from "./errors/handleError";
import webhookRoutes from "./routes/webhook.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/webhook", webhookRoutes);

app.use(handleError);

export default app;