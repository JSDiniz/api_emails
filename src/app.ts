import express, { Application } from "express";
import cors from "cors";
import cron from "node-cron";
import appointmentsRoutes from "./routes/appointments.routes";
import availabilityRoutes from "./routes/availability.routes";
import handleError from "./errors/handleError";
import whatsappRoutes from "./routes/whatsapp.routes";
import { sendPresenceServices } from "./services/presence/sendPresence.services";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/whatsapp", whatsappRoutes)

app.use(handleError);

// ================= CRON JOB =================
// Executa o sendPresenceServices automaticamente 3 vezes ao dia: 08:01, 12:00 e 17:00
const presenceTimes = ["12:03", "16:00", "21:00"]; // horários ajustados para UTC

presenceTimes.forEach(time => {
    const [hour, minute] = time.split(":").map(Number);
    cron.schedule(`${minute} ${hour} * * *`, async () => {
        try {
            console.log(`🔔 Rodando sendPresenceServices automaticamente às ${time}...`);
            await sendPresenceServices();
        } catch (err) {
            console.error(`❌ Erro no cron do horário ${time}:`, err);
        }
    });
});

export default app;