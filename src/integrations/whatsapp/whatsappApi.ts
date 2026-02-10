import "dotenv/config";
import axios from "axios";

const whatsappApi = axios.create({
    baseURL: `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`, // base da API do WhatsApp
    timeout: 5000,
    headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export default whatsappApi;
