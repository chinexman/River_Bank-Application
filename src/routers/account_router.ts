import {
  createAccount,
  updateAccount,
  getAllAccounts,
  getAccountBalance,
  depositFunds,
  withdrawFunds,
  transferFunds,
  getAccountHistory,
} from "../controllers/accountController";
import { Router } from "express";

import Authorization from "../Auth/users_authorization";

const router = Router();

router.post("/create", Authorization, createAccount);
router.put("/updateaccount/:accountId", Authorization, updateAccount);
router.get("/getaccounts", Authorization, getAllAccounts);
router.post("/getaccountbalance", Authorization, getAccountBalance);
router.post("/deposit/:accountId", Authorization, depositFunds );
router.post("/withdraw/:accountId", Authorization, withdrawFunds);
router.post("/transfer/:senderId", Authorization, transferFunds);
router.post("/getaccounthistory", Authorization, getAccountHistory);




export default router;
