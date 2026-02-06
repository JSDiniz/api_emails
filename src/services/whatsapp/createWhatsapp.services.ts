import "dotenv/config";
import axios from "axios";

export interface FormData {
    phone: string;
    message: string;
}

export async function createWhatsappServices({ phone, message }: FormData) {

    const normalizedPhone = phone.replace(/\D/g, "");
    const finalPhone = normalizedPhone.startsWith("55")
        ? normalizedPhone
        : `55${normalizedPhone}`;

    try {
        const response = await axios.post(
            `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
            {
                number: finalPhone, // ex: 5511999999999
                text: message,
            },
            {
                headers: {
                    apikey: process.env.EVOLUTION_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            success: true,
            data: response.data,
        };

    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data || error.message,
        };
    }
}
