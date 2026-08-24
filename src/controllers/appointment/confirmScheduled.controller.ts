import { Request, Response } from "express";
import sendPresenceService from "../../services/presence/sendPresence.service";
const expectedToken = process.env.CRON_SECRET;

const confirmScheduledController = async (req: Request, res: Response) => {

    const authHeader = req.headers.authorization;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
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
