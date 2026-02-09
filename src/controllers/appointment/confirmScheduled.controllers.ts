import { Request, Response } from "express";
import { sendPresenceServices } from "../../services/presence/sendPresence.services";


const confirmScheduledController = async (req: Request, res: Response) => {
    if (!req.headers["x-vercel-cron"]) {
        return res.status(401).send("Unauthorized");
    }
    try {

        await sendPresenceServices()

        console.log("[CRON] send Presence Services executada!");

        res.status(200).send("Função executada!");
    } catch (err) {
        console.error("[CRON] Erro:", err);
        res.status(500).send("Erro ao executar função");
    }
};

export default confirmScheduledController;
