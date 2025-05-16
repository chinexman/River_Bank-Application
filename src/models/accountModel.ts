import mongoose from "mongoose";
import {transactionsInterface} from '../interfaces/interface'

export interface AccountInterface {
  owner: string;
  accountnumber: string;
  accountbalance:number;
  createdAt: string;
  updatedAt: string;
  transactions?: transactionsInterface[]; 
}

const TransactionSchema = new mongoose.Schema<transactionsInterface>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['transfer'], // you can add more types if needed
    default: 'transfer',
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
  description: {
    type: String,
  }
});

const accountsSchema = new mongoose.Schema<AccountInterface>(
  {
    owner: {
      type: String,
      required: true,
    },
    accountnumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountbalance:{
      type: Number,
      default: 0
    },
    transactions: [TransactionSchema], // ✅ embedded subdocuments
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model<AccountInterface>("accounts", accountsSchema);

export default Account;
