import express, { Application } from "express";
import cors from "cors";

import whatsappRoutes from "./routes/whatsapp.routes";
import whatsappWebhookRoutes from "./routes/whatsappWebhook.routes";

import evolutionWebhookRoutes from "./routes/evolutionWebhook.routes";

import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";

import handleError from "./errors/handleError";

const app: Application = express();
app.use(cors());

app.use(
    express.json({
        verify: (req: any, res, buf) => {
            req.rawBody = buf;
        }
    })
);

app.use("/whatsapp", whatsappRoutes)
app.use("/webhooks/whatsapp", whatsappWebhookRoutes);

app.use("/webhooks/evolution", evolutionWebhookRoutes);

app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);

app.use(handleError);

export default app;