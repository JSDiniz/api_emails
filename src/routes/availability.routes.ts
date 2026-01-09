import { Router } from "express";
import { availabilityController } from "../controllers/availability/availabilityController";

const availabilityRoutes = Router();

availabilityRoutes.get("/", availabilityController);

export default availabilityRoutes;