import { Request, Response } from "express";
import sendPresenceService from "../../services/presence/sendPresence.service";


const confirmScheduledController = async (req: Request, res: Response) => {

    const authHeader = req.headers.authorization;

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    try {
        await sendPresenceService()

        res.status(200).send("Função executada!");
    } catch (err) {
        console.error("[CRON] Erro:", err);
        res.status(500).send("Erro ao executar função");
    }
};

export default confirmScheduledController;
