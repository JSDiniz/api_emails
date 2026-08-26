import { Router } from "express";
import evolutionWebhookController from "../controllers/evolution/evolutionWebhook.controller";

const evolutionWebhookRoutes = Router();

// recebe eventos do WhatsApp (webhook)
evolutionWebhookRoutes.post("/", evolutionWebhookController);

export default evolutionWebhookRoutes;
