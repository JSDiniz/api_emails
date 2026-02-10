import { Router } from "express";
import verifyWhatsAppWebhookController from "../controllers/webhooks/handleWhatsAppWebhook.controller";
import handleWhatsAppWebhookController from "../controllers/webhooks/verifyWhatsAppWebhook.controller";

const whatsappWebhookRoutes = Router();


whatsappWebhookRoutes.get("/", verifyWhatsAppWebhookController)


whatsappWebhookRoutes.post("/", handleWhatsAppWebhookController)

export default whatsappWebhookRoutes;