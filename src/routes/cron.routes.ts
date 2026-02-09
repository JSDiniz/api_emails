import { Router } from "express";
import cronController from "../controllers/cron/cron.crontollers";

const cronppRoutes = Router();

cronppRoutes.get("/cron", cronController);

export default cronppRoutes;
