import { Router } from "express";
import { sendPresenceServices } from "../services/presence/sendPresence.services";

const cronRoutes = Router();

cronRoutes.get("/cron/presence", async (req, res) => {
    try {
        console.log("🔔 CRON DA VERCEL EXECUTADO (17:20 UTC | 13:20 Manaus)");
        await sendPresenceServices();
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("❌ Erro no cron da Vercel", err);
        return res.status(500).json({ error: true });
    }
});

export default cronRoutes;
