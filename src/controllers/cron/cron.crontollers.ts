import { Request, Response } from "express";


const cronController = async (req: Request, res: Response) => {
    try {

        console.log("[CRON] send Presence Services executada!");

        res.status(200).send("Função executada!");
    } catch (err) {
        console.error("[CRON] Erro:", err);
        res.status(500).send("Erro ao executar função");
    }
};

export default cronController;
