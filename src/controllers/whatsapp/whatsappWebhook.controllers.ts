import { Request, Response } from "express";
import { presenceStore } from "../../store/presence.store";
import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";
import { sendConfirmedPresence } from "../../services/presence/sendConfirmedPresence.services";
import { deleteAppointmentServices } from "../../services/appointment/deleteAppointment.services";
import { confirmPresenceService } from "../../services/presence/confirmPresence.services";


export async function whatsappWebhook(req: Request, res: Response) {

    const message =
        req.body?.data?.message?.conversation ||
        req.body?.data?.message?.extendedTextMessage?.text;

    const phoneRaw =
        req.body?.data?.key?.remoteJid
            ?.replace("@s.whatsapp.net", "");


    if (!message || !phoneRaw) return res.sendStatus(200);

    const normalizedMessage = message.trim();
    const phoneForWhatsapp = normalizePhoneForWhatsapp(phoneRaw);

    // ✅ primeiro verifica se existe presença para esse telefone
    const presence = presenceStore.find(item => item.phone === phoneForWhatsapp);

    if (!presence) {
        // telefone não está no store, ignora a mensagem
        return res.sendStatus(200);
    }

    // ✅ CONFIRMAÇÃO
    if (normalizedMessage === "1") {
        await confirmPresenceService(phoneForWhatsapp)
    }

    // ❌ CANCELAMENTO
    if (normalizedMessage === "2") {
        await sendConfirmedPresence({
            phone: phoneForWhatsapp,
            text: "❌ O seu agendamento será cancelado. Para marcar um novo horário, acesse: https://dra.estefanyoliveira.com.br/",
        });

        // cancela o agendamento
        await deleteAppointmentServices(presence.id);

        // remove do store
        const index = presenceStore.indexOf(presence);
        if (index !== -1) presenceStore.splice(index, 1);
    }

    return res.sendStatus(200);
}

