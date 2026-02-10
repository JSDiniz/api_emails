import { Request, Response } from "express";
import sendPresenceService from "../../services/presence/sendPresence.service";


const confirmScheduledController = async (req: Request, res: Response) => {

    if (!req.headers["x-vercel-cron"]) {
        return res.status(401).send("Unauthorized");
    }

    try {

        console.log("[CRON] send Presence Services executada!");

        await sendPresenceService()

        res.status(200).send("Função executada!");
    } catch (err) {
        console.error("[CRON] Erro:", err);
        res.status(500).send("Erro ao executar função");
    }
};

export default confirmScheduledController;
