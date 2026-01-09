import express from "express";
import { 
  getAdminStats, 
  getAdminIssues, 
  updateIssueStatus 
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/issues", getAdminIssues);
router.put("/updateStatus/:id", updateIssueStatus);

export default router;
