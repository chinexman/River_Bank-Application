// controllers/notificationController.ts
import { Request, Response } from "express";
import Notification from "../models/notificationModel";

export async function getUserNotifications(req: any, res: Response) {
  try {
    const userId = req.user.user_id;
    const notifications = await Notification.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(400).json({ msg: "Failed to fetch notifications", err });
  }
}

export async function markAllAsRead(req: any, res: Response) {
  try {
    const userId = req.user.user_id;
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    res.status(200).json({ msg: "Notifications marked as read" });
  } catch (err) {
    res.status(400).json({ msg: "Failed to update notifications", err });
  }
}
