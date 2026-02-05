import { Router } from "express";
import { Request, Response } from "express";

const webhookRoutes = Router();

webhookRoutes.get("/", (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("✅ Webhook verificado com sucesso");
        return res.status(200).send(challenge);
    }

    console.log("❌ Falha na verificação do webhook");
    return res.sendStatus(403);
});

/**
 * 🔹 RECEBIMENTO DE EVENTOS (POST)
 */
webhookRoutes.post("/", (req: Request, res: Response) => {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Mensagem recebida
    const message = value?.messages?.[0];

    if (message) {
        const from = message.from; // telefone do usuário
        const text = message.text?.body;

        console.log("📩 Nova mensagem");
        console.log("De:", from);
        console.log("Mensagem:", text);
    }

    // Status da mensagem (enviada, entregue, lida)
    const statuses = value?.statuses?.[0];
    if (statuses) {
        console.log("📬 Status:", statuses.status);
    }

    return res.sendStatus(200);
});


export default webhookRoutes;