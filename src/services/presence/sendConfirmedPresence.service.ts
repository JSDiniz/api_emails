import "dotenv/config";
import axios from "axios";

interface SendWhatsappTextProps {
    phone: string;
    text: string;
}

const sendConfirmedPresenceService = async ({
    phone,
    text,
}: SendWhatsappTextProps) => {

    const normalizedPhone = phone.replace(/\D/g, "");
    const finalPhone = normalizedPhone.startsWith("55")
        ? normalizedPhone
        : `55${normalizedPhone}`;

    console.log("========== [SEND WHATSAPP] ==========");

    console.log(
        "[WHATSAPP] Telefone original:",
        phone
    );

    console.log(
        "[WHATSAPP] Telefone final:",
        finalPhone
    );

    console.log(
        "[WHATSAPP] Mensagem:",
        text
    );

    console.log(
        "[WHATSAPP] URL:",
        `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`
    );

    await axios.post(
        `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
        {
            number: finalPhone,
            text,
            linkPreview: false,
        },
        {
            headers: {
                apikey: process.env.EVOLUTION_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );

    console.log(
        "[WHATSAPP] ✅ Mensagem enviada pela Evolution."
    );
}


export default sendConfirmedPresenceService