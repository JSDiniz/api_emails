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

// 🔹 CRON JOB - roda todos os dias às 5h
cron.schedule("25 19 * * *", async () => {
    try {
        // Chamando a função diretamente
        // await sendPresenceServices();
        console.log("sendPresenceServices executada com sucesso!");
    } catch (err) {
        console.error("Erro ao chamar a rota:", err);
    }
});

export default app;