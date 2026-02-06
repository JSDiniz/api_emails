import "dotenv/config";
import axios from "axios";

interface SendWhatsappTextProps {
    phone: string;
    text: string;
}

export async function sendConfirmedPresence({
    phone,
    text,
}: SendWhatsappTextProps) {

    const normalizedPhone = phone.replace(/\D/g, "");
    const finalPhone = normalizedPhone.startsWith("55")
        ? normalizedPhone
        : `55${normalizedPhone}`;

    await axios.post(
        `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
        {
            number: finalPhone,
            text,
        },
        {
            headers: {
                apikey: process.env.EVOLUTION_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
}
