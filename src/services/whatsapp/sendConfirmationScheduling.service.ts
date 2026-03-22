import "dotenv/config";
import whatsappApi from "../../integrations/whatsapp/whatsappApi";

const sendConfirmationSchedulingService = async (
    to: string,
    patientName: string,
    doctorName: string,
    date: string,
    time: string,
    address: string
) => {
    try {
        await whatsappApi.post("/messages", {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
                name: `${process.env.WHATSAPP_REMINDER_CONFIRMATION_TEMPLATE}`,
                language: { code: "pt_BR" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: patientName },
                            { type: "text", text: doctorName },
                            { type: "text", text: date },
                            { type: "text", text: time },
                            { type: "text", text: address }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "quick_reply",
                        index: "0",
                        parameters: [
                            { type: "payload", payload: "confirm_yes" }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "quick_reply",
                        index: "1",
                        parameters: [
                            { type: "payload", payload: "confirm_no" }
                        ]
                    }
                ]
            }
        });

        console.log("✅ Mensagem enviada:", to);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error);
    }
};

export default sendConfirmationSchedulingService