// routes/notificationRoutes.ts
import express from "express";
import { getUserNotifications, markAllAsRead } from "../controllers/notificationController";
import Authorization from "../Auth/users_authorization";

const router = express.Router();

router.get("/", Authorization, getUserNotifications);
router.put("/mark-all-read", Authorization, markAllAsRead);

export default router;
