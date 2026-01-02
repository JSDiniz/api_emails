import express, { Application } from "express";
import cors from "cors";
import appointmentsRoutes from "./routes/appointments.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentsRoutes);

export default app;