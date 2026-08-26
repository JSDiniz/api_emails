import { Request, Response } from "express";
import { presenceStore } from "../../store/presence.store";
import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";
import sendConfirmedPresenceService from "../../services/presence/sendConfirmedPresence.service";
import deleteAppointmentService from "../../services/appointment/deleteAppointment.service";
import confirmPresenceService from "../../services/presence/confirmPresence.service";

const evolutionWebhookController = async (req: Request, res: Response) => {

    const message =
        req.body?.data?.message?.conversation ||
        req.body?.data?.message?.extendedTextMessage?.text;

    const phoneRaw =
        req.body?.data?.key?.remoteJid
            ?.replace("@s.whatsapp.net", "");

    if (!message || !phoneRaw) return res.sendStatus(200);

    const normalizedMessage = message.trim();
    const phoneForWhatsapp = normalizePhoneForWhatsapp(phoneRaw);

    const presence = presenceStore.find(item => item.phone === phoneForWhatsapp);

    if (!presence) {
        return res.sendStatus(200);
    }

    try {
        if (["1", "1️⃣"].includes(normalizedMessage)) {
            await confirmPresenceService(phoneForWhatsapp);
        }

        if (["2", "2️⃣"].includes(normalizedMessage)) {
            await sendConfirmedPresenceService({
                phone: phoneForWhatsapp,
                text: "📅 Para reagendar um novo atendimento, acesse: https://dra.estefanyoliveira.com.br/",
            });

            await deleteAppointmentService(presence.id);

            const index = presenceStore.indexOf(presence);

            if (index !== -1) {
                presenceStore.splice(index, 1);
            }
        }

        return res.sendStatus(200);

    } catch (error) {
        console.error("Erro no evolutionWebhookController:", error);
        return res.sendStatus(500);
    }
}

export default evolutionWebhookController