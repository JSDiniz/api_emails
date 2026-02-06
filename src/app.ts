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
// Executa o sendPresenceServices automaticamente 3 vezes ao dia: 09:00, 12:00 e 17:00 (Manaus / UTC-4)
// const presenceTimes = ["12", "17", "21"]; // horários ajustados para UTC

// presenceTimes.forEach(hour => {
//     cron.schedule(`0 ${hour} * * *`, async () => {
//         try {
//             console.log(`🔔 Rodando sendPresenceServices automaticamente às ${hour}:00...`);
//             await sendPresenceServices();
//         } catch (err) {
//             console.error(`❌ Erro no cron do horário ${hour}:00`, err);
//         }
//     });
// });

cron.schedule(`10 17 * * *`, async () => {
    try {
        console.log(`🔔 Rodando sendPresenceServices automaticamente às 13:10...`);
        await sendPresenceServices();
    } catch (err) {
        console.error(`❌ Erro no cron do horário 13:10`, err);
    }
});

export default app;