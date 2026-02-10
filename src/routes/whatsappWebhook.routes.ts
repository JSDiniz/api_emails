import { Router } from "express";
import { verifyWhatsAppWebhookController } from "../controllers/webhooks/handleWhatsAppWebhook.controllers";
import { handleWhatsAppWebhookController } from "../controllers/webhooks/verifyWhatsAppWebhook.controllers";

const whatsappWebhookRoutes = Router();


whatsappWebhookRoutes.get("/", verifyWhatsAppWebhookController)


whatsappWebhookRoutes.post("/", handleWhatsAppWebhookController)

export default whatsappWebhookRoutes;