import { Request, Response } from "express";
import { presenceStore } from "../../store/presence.store";
import { normalizePhoneForWhatsapp } from "../../utils/phone.utils";
import sendConfirmedPresenceService from "../../services/presence/sendConfirmedPresence.service";
import deleteAppointmentService from "../../services/appointment/deleteAppointment.service";
import confirmPresenceService from "../../services/presence/confirmPresence.service";

const evolutionWebhookController = async (req: Request, res: Response) => {
    console.log("========== [EVOLUTION WEBHOOK] ==========");

    console.log(
        "[WEBHOOK] Body recebido:",
        JSON.stringify(req.body, null, 2)
    );

    const message =
        req.body?.data?.message?.conversation ||
        req.body?.data?.message?.extendedTextMessage?.text;

    const phoneRaw =
        req.body?.data?.key?.remoteJid
            ?.replace("@s.whatsapp.net", "");

    console.log("[WEBHOOK] Mensagem:", message);
    console.log("[WEBHOOK] phoneRaw:", phoneRaw);

    if (!message || !phoneRaw) {
        console.log(
            "[WEBHOOK] Mensagem ou telefone ausente."
        );
        return res.sendStatus(200)
    };

    const normalizedMessage = message.trim();
    const phoneForWhatsapp = normalizePhoneForWhatsapp(phoneRaw);

    console.log(
        "[WEBHOOK] Mensagem normalizada:",
        normalizedMessage
    );

    console.log(
        "[WEBHOOK] Telefone normalizado:",
        phoneForWhatsapp
    );

    console.log(
        "[WEBHOOK] PresenceStore:",
        presenceStore
    );

    const presence = presenceStore.find(item => item.phone === phoneForWhatsapp);

    console.log(
        "[WEBHOOK] Presence encontrada:",
        presence
    );


    if (!presence) {
        console.log(
            "[WEBHOOK] ❌ PRESENCE NÃO ENCONTRADA"
        );

        console.log(
            "[WEBHOOK] Telefones existentes no store:",
            presenceStore.map(item => item.phone)
        );
        return res.sendStatus(200);
    }

    console.log(
        "[WEBHOOK] ✅ PRESENCE ENCONTRADA"
    );


    try {
        if (["1", "1️⃣"].includes(normalizedMessage)) {
            console.log(
                "[WEBHOOK] 🟢 Usuário escolheu 1"
            );

            console.log(
                "[WEBHOOK] Chamando confirmPresenceService..."
            );

            const result = await confirmPresenceService(phoneForWhatsapp);

            console.log(
                "[WEBHOOK] Resultado confirmPresenceService:",
                result
            );
        }

        if (["2", "2️⃣"].includes(normalizedMessage)) {
            console.log(
                "[WEBHOOK] 🔴 Usuário escolheu 2"
            );


            await sendConfirmedPresenceService({
                phone: phoneForWhatsapp,
                text: "📅 Para reagendar um novo atendimento, acesse: https://dra.estefanyoliveira.com.br/",
            });


            console.log(
                "[WEBHOOK] Mensagem de reagendamento enviada."
            );

            await deleteAppointmentService(presence.id);

            console.log(
                "[WEBHOOK] Evento excluído:",
                presence.id
            );

            const index = presenceStore.indexOf(presence);

            if (index !== -1) {
                presenceStore.splice(index, 1);

                console.log(
                    "[WEBHOOK] Presence removida do store."
                );
            }
        }


        console.log(
            "[WEBHOOK] ✅ Finalizando com 200"
        );

        return res.sendStatus(200);

    } catch (error) {
        console.error(
            "[WEBHOOK] ❌ ERRO:",
            error
        );

        console.error("Erro no evolutionWebhookController:", error);
        return res.sendStatus(500);
    }
}

export default evolutionWebhookController