import { Router } from "express";
import {
  getClients,
  createClient,
  getClient,
  updateClient,
  deleteClient
} from "../controllers/client.controller";

const router = Router();

router.get("/", getClients);
router.post("/", createClient);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;