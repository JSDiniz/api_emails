import express, { Application } from "express";
import cors from "cors";
import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);

export default app;