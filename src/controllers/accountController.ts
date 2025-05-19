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
    balance :balance
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
  console.log("req.body depositFunds",req.body)
  console.log("req.params depositFunds",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    // receiver: joi.string().min(3).max(20).required(),
    amount:joi.string().min(0).max(20).required(),
    // description: joi.string().required(),

  });
  //error messages
  const accountUpdate = accountSchema.validate(req.body);
  console.log("accountUpdate",accountUpdate)
  if (accountUpdate.error) {
    return res.status(400).json({
      message: accountUpdate.error.details[0].message,
    });
  }
  let account = await accountModel.findOne({ accountnumber: accountnumber });
   console.log(" depositFunds account exist",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }

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

  console.log(" depositFunds updateAccount",updateAccount)

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
  console.log("req.body withdrawFunds",req.body)
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
   console.log("account withdrawFunds exist",account)


  if (!account) {
    return res.status(404).json({
      msg: "Account does not exist.",
    });
  }

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
  console.log("withdrawFunds updateAccount",updateAccount)

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
  const { accountnumber,receiver , receiverId ,amount ,type} = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    receiver: joi.string().min(3).max(20).required(),
    receiverId: joi.string().min(3).max(50).required(),
    amount:joi.string().min(0).max(20).required(),
    description: joi.string().required(),
    type: joi.string().valid("deposit", "withdraw", "transfer").optional(),


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
console.log("updateSenderAccount",updateSenderAccount)
console.log("updateRecieverAccount",updateRecieverAccount)

  let transaction = await TransactionModel.create({
    sender: senderId,
    receiver: receiverId,
    amount: +amount,
    type: type,
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
  const { accountnumber , startDate, endDate, type ,page = 1, limit = 10 } = req.body;
  console.log("req.body getAccount Balance",req.body)
  console.log("req.params",req.params)

  //validating
  const accountSchema = joi.object({
    accountnumber: joi.string().min(3).max(20).required(),
    startDate: joi.date().optional(),
    endDate: joi.date().optional(),
    type: joi.string().valid("deposit", "withdraw", "transfer").optional(),
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

      // Build dynamic query
      const query: any = {
        $or: [
          { sender: account._id },
          { receiver: account._id },
        ]
      };
  
      if (type) {
        query.type = type;
      }
  
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // include entire endDate
          query.date.$lte = end;
        }      }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
     
     
     
        // Fetch transactions involving this account (as sender or receiver)
        const [transactions, total] = await Promise.all([
          TransactionModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNumber),
          TransactionModel.countDocuments(query),
        ]);
    

//  const transactions = await TransactionModel.find(query).sort({ date: -1 }); // Optional: latest first

res.status(200).json({
  msg: "Transaction history retrieved successfully",
  transactions,
  pagination: {
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
  },
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
