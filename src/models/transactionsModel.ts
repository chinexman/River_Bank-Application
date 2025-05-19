import mongoose from "mongoose";
import { transactionsInterface } from "../interfaces/interface";

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
    enum: ['transfer','deposit','withdraw'], // you can add more types if needed
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
  const TransactionModel = mongoose.model('Transaction', TransactionSchema);

export default TransactionModel;
