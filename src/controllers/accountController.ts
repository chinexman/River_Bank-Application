import Account from "../models/accountModel";
import express, { Response, Request } from "express";
import accountModel from "../models/accountModel";
import TransactionModel  from '../models/transactionsModel';
import joi from "joi";
type customRequest = Request & {
  user?: { user_id?: string; email?: string; name?: string };
};

async function createAccount(req: customRequest, res: Response) {
  try{
  const user_id = req.user?.user_id;

  const { accountnumber } = req.body;
  const accountsSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
  });

  const accountValidate = accountsSchema.validate(req.body);
console.log("accountnumber",accountnumber)
  if (accountValidate.error) {
    return res.status(400).json({
      message: accountValidate.error.details[0].message,
    });
  }

  let findAccount = await accountModel.findOne({ accountnumber: accountnumber });
  console.log("findAccount",findAccount)
  if (findAccount) {
  return  res.status(400).json({
      message: "Account number already exist",
    });
  }

  const newAccount = await accountModel.create({
    owner: user_id,
    accountnumber: accountnumber,
  });

  return res.status(201).json({
    status: "success",
    data: newAccount,
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}

async function updateAccount(req: customRequest, res: Response) {
  try{
  //extract details
  const user_id = req.user?.user_id;
  const accountId = req.params.accountId;
  const { accountnumber } = req.body;
  console.log("req.body",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  const account = await Account.findById(accountId); 
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }

  //accessing database
  let updateAccount = await Account.findOneAndUpdate(
    { _id: accountId },
    { accountnumber: accountnumber },
    { new: true }
  );
  res.status(200).json({
    updatedAccount: updateAccount,
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}


async function getAccountBalance(req: customRequest, res: Response) {
  try{
  //extract details
  const user_id = req.user?.user_id;
  // const accountId = req.params.accountId;
  const { accountnumber } = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }
  const balance = account?.accountbalance
  const accountno = account?.accountnumber

  //accessing database
  // let updateAccount = await Account.findOneAndUpdate(
  //   { _id: accountId },
  //   { accountnumber: accountnumber },
  //   { new: true }
  // );
  res.status(200).json({
    "Account Balance is #" :balance
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}

async function depositFunds(req: customRequest, res: Response) {
  try{
  //extract details
  const user_id = req.user?.user_id;
  const accountId = req.params.accountId;
  const { accountnumber,amount } = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    // receiver: joi.string().min(3).max(20).required(),
    amount:joi.string().min(0).max(20).required(),
    // description: joi.string().required(),

  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }
  const balance = +account?.accountbalance + +amount
  // const accountno = account?.accountnumber

  //accessing database
  let updateAccount = await Account.findOneAndUpdate(
    { _id: accountId },
    { accountbalance: balance },
    { new: true }
  );

  res.status(200).json({
    updatedAccount: updateAccount,
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}


async function withdrawFunds(req: customRequest, res: Response) {
  try{
  //extract details
  const user_id = req.user?.user_id;
  const accountId = req.params.accountId;
  const { accountnumber,amount } = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    // receiver: joi.string().min(3).max(20).required(),
    amount:joi.string().min(0).max(20).required(),
    // description: joi.string().required(),

  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }
let balance
     if(+account?.accountbalance >= +amount){
   balance = +account?.accountbalance - +amount
     }else{
      return   res.status(200).json({
       msg: "Insuficient Funds"
      });
     }
  // const accountno = account?.accountnumber

  //accessing database
  let updateAccount = await Account.findOneAndUpdate(
    { _id: accountId },
    { accountbalance: balance },
    { new: true }
  );

  res.status(200).json({
    updatedAccount: updateAccount,
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}

async function transferFunds(req: customRequest, res: Response) {

  try{
  //extract details
  const user_id = req.user?.user_id;
  const senderId = req.params.senderId;
  const { accountnumber,receiver , receiverId ,amount} = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    receiver: joi.string().min(3).max(20).required(),
    receiverId: joi.string().min(3).max(50).required(),
    amount:joi.string().min(0).max(20).required(),
    description: joi.string().required(),

  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Sender Account does not exist.",
    });
  }

  let accountReciever = await accountModel.findOne({ accountnumber: receiver });
  console.log("account",account)


 if (!accountReciever) {
   return res.status(404).json({
     msg: "Reciever Account does not exist.",
   });
 }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }

  let senderBalance
  let receiverBalance
     if(+account?.accountbalance >= +amount){
   senderBalance = +account?.accountbalance - +amount
   receiverBalance = +accountReciever?.accountbalance + +amount


     }else{
      return   res.status(200).json({
       msg: "Insuficient Funds"
      });
     }
  // const balance = account?.accountbalance
  // const accountno = account?.accountnumber

 
  let updateSenderAccount = await Account.findOneAndUpdate(
    { _id: senderId },
    { accountbalance: senderBalance },
    { new: true }
  );

  let updateRecieverAccount = await Account.findOneAndUpdate(
    { _id: receiverId },
    { accountbalance: receiverBalance },
    { new: true }
  );

  let transaction = await TransactionModel.create({
    sender: senderId,
    receiver: receiverId,
    amount: +amount,
    type: 'transfer',
    description: req.body.description,
    date: new Date(),
  });

  await Account.findByIdAndUpdate(senderId, {
    $push: { transactions: transaction }
  });
  await Account.findByIdAndUpdate(receiverId, {
    $push: { transactions: transaction }
  });
  res.status(200).json({
    msg: "Transfer successful",
    sender: updateSenderAccount,
    receiver: updateRecieverAccount,
    transaction,
  });

} catch (err) {
  res.status(400).json({ msg: err });
}
}


async function getAccountHistory(req: customRequest, res: Response) {

  try{
  //extract details
  const user_id = req.user?.user_id;
  // const accountId = req.params.accountId;
  const { accountnumber } = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log("account",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }
  console.log("account",account)

  if (account.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this account.",
    });
  }

 // Fetch transactions involving this account (as sender or receiver)
 const transactions = await TransactionModel.find({
  $or: [
    { sender: account._id },
    { receiver: account._id }
  ]
}).sort({ date: -1 }); // Optional: latest first

res.status(200).json({
  msg: "Transaction history retrieved successfully",
  transactions,
});

} catch (err) {
  res.status(400).json({ msg: err });
}
}

async function getAllAccounts(req: customRequest, res: Response) {
  try{
  //extract details
  const user_id = req.user?.user_id;
  const accounts = await Account.find({
    $or: [{ owner: user_id }, { "$email": req.user?.email }],
  });
  if (accounts.length === 0) {
    res.status(404).json({
      msg: "There are no accounts available.",
    });
  } else {
    res.status(200).json({ accounts });
  }
} catch (err) {
  res.status(400).json({ msg: err });
}
}

export { createAccount, updateAccount, getAllAccounts ,getAccountBalance ,depositFunds,withdrawFunds ,transferFunds ,getAccountHistory};
