import express, { Application } from "express";
import cors from "cors";

import whatsappRoutes from "./routes/whatsapp.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";

import handleError from "./errors/handleError";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/whatsapp", whatsappRoutes)
app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);

app.use(handleError);

export default app;