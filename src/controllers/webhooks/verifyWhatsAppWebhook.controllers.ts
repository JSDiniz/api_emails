import { Request, Response } from "express";
import crypto from "crypto";
import { sendMessage } from "../../services/whatsapp/sendMessage.services";

export function handleWhatsAppWebhookController(req: Request, res: Response) {

    const signature = req.headers["x-hub-signature-256"] as string;

    if (!signature || !req.rawBody) {
        return res.sendStatus(403);
    }

    const expected =
        "sha256=" +
        crypto
            .createHmac("sha256", process.env.WHATSAPP_APP_SECRET!)
            .update(req.rawBody)
            .digest("hex");

    const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );

    if (!isValid) {
        return res.sendStatus(403);
    }

    // ✅ Requisição legítima da Meta
    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    const message = value?.messages?.[0];
    const statuses = value?.statuses?.[0];


    // 📩 Mensagem recebida do cliente
    if (message) {
        const from = message.from;
        const text = message.text?.body;

        // 1️⃣ Caso seja clique em botão
        const buttonReply = message.button?.payload;

        if (buttonReply) {
            console.log("buttonReply: ", buttonReply)
        }

        if (text) {
            console.log("Texto recebido: ", text);
            console.log("from: ", from)

            const replyText = `Olá.\n\nEste número é utilizado exclusivamente para o envio de avisos, confirmações e lembretes automáticos de agendamento.\n\nNo momento, não realizamos atendimento por este canal.\n\nDesde já, agradecemos a compreensão.`;

            sendMessage(from, replyText)
        }
    }

    // 📤 Status de mensagem enviada
    if (statuses) {
        const status = value.statuses[0];
        console.log("📦 Status:", status.status);
        console.log("📞 Para:", status.recipient_id);
    }

    return res.sendStatus(200);


}
