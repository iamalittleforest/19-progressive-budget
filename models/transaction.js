// reference mongoose and define Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define transactionSchema
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

// create Transaction model from transactionSchema
const Transaction = mongoose.model("Transaction", transactionSchema);

// export the model
module.exports = Transaction;