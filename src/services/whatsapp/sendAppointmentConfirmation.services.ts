import "dotenv/config";
import whatsappApi from "../../integrations/whatsapp/whatsappApi";

export const sendAppointmentConfirmation = async (
    to: string,
    patientName: string,
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
                name: `${process.env.WHATSAPP_CONFIRMATION_TEMPLATE}`,
                language: { code: "pt_BR" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: patientName },
                            { type: "text", text: date },
                            { type: "text", text: time },
                            { type: "text", text: address }
                        ]
                    },
                ]
            }
        });

        console.log("✅ Mensagem enviada:", to);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error);
    }
};