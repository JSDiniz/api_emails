import { Router } from "express";
import { evolutionWebhookController } from "../controllers/evolution/evolutionWebhook.controllers";

const evolutionWebhookRoutes = Router();

// 🔹 recebe eventos do WhatsApp (webhook)
evolutionWebhookRoutes.post("/", evolutionWebhookController);

export default evolutionWebhookRoutes;
