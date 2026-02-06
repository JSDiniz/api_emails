import { Router } from "express";
import { whatsappWebhook } from "../controllers/whatsapp/whatsappWebhook.controllers";

const whatsappRoutes = Router();

// 🔹 recebe eventos do WhatsApp (webhook)
whatsappRoutes.post("/webhook", whatsappWebhook);

export default whatsappRoutes;
