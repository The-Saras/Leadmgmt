import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from "../controllers/leadController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router: Router = Router();


router.use(authMiddleware);


router.get("/export", roleMiddleware("admin"), exportLeads);


router.get("/", getLeads);
router.post("/", roleMiddleware("admin", "sales"), createLead);
router.get("/:id", getLeadById);
router.put("/:id", roleMiddleware("admin", "sales"), updateLead);
router.delete("/:id", roleMiddleware("admin"), deleteLead);

export default router;