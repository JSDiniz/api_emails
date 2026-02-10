import { Request, Response } from "express";

const verifyWhatsAppWebhookController = (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("✅ Webhook verificado com sucesso");
        return res.status(200).send(challenge);
    }

    console.log("❌ Falha na verificação do webhook");
    return res.sendStatus(403);

}

export default verifyWhatsAppWebhookController