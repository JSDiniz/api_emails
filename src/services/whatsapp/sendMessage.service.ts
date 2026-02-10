import whatsappApi from "../../integrations/whatsapp/whatsappApi";

const sendMessageService = async (to: string, message: string) => {
    try {
        await whatsappApi.post("/messages", {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "text",
            text: {
                preview_url: false,
                body: message,
            },
        });
        console.log("✅ Mensagem enviada:", to);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error);
    }
};

export default sendMessageService