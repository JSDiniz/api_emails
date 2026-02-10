import { Router } from "express";
import { availabilityController } from "../controllers/availability/availability.controller";

const availabilityRoutes = Router();

availabilityRoutes.get("/", availabilityController);

export default availabilityRoutes;