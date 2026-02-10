import { Request, Response } from "express";
import crypto from "crypto";
import sendMessageService from "../../services/whatsapp/sendMessage.service";
import updateGoogleCalendarEventService from "../../services/email/updateGoogleCalendarEvent.service";
import { presenceStore } from "../../store/presence.store";
import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";
import deleteAppointmentService from "../../services/appointment/deleteAppointment.service";

const handleWhatsAppWebhookController = async (req: Request, res: Response) => {

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

    // Requisição legítima da Meta
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
            const presence = presenceStore.find(p => p.phone === normalizePhoneForWhatsapp(from));

            if (!presence) {
                return res.sendStatus(200);
            }

            // Ignora cliques duplicados
            if (presence.status === "confirmed" || presence.status === "cancelled") {
                return res.sendStatus(200);;
            }

            if (buttonReply === "confirm_yes") {

                //atualizar o calendario
                const response = await updateGoogleCalendarEventService(presence.id)

                //mplementar a lógica para que, caso a confirmação do agendamento retorne false, o sistema tente realizar o agendamento novamente.

                if (response) {
                    // Atualiza o status no presenceStore
                    presence.status = "confirmed";

                    const replyText = `✅ Presença confirmada. Obrigado!`;
                    sendMessageService(from, replyText)
                }

            } else if (buttonReply === "confirm_no") {

                await deleteAppointmentService(presence.id)

                const replyText = `Seu agendamento foi cancelado.\n\nA solicitação foi processada com sucesso.\n\nPara realizar um novo agendamento, utilize o link abaixo.\n\nhttps://dra.estefanyoliveira.com.br/`;

                sendMessageService(from, replyText)

                // Remove do presenceStore
                const index = presenceStore.indexOf(presence)
                if (index !== -1) presenceStore.splice(index, 1)
            }

        } else if (text) {
            console.log("Texto recebido: ", text);
            console.log("from: ", from)

            const replyText = `Olá.\n\nEste número é utilizado exclusivamente para o envio de avisos, confirmações e lembretes automáticos de agendamento.\n\nNo momento, não realizamos atendimento por este canal.\n\nDesde já, agradecemos a compreensão.`;

            sendMessageService(from, replyText)
        }
    }

    // // 📤 Status de mensagem enviada
    // if (statuses) {
    //     const status = value.statuses[0];
    //     console.log("📦 Status:", status.status);
    //     console.log("📞 Para:", status.recipient_id);
    // }

    return res.sendStatus(200);
}

export default handleWhatsAppWebhookController
