import mongoose from "mongoose";

const fine = mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      ref: "raid",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fineReciept: {
      type: String,
      required: true,
    },
    bankReciept: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Fine = mongoose.model("fine", fine);

export default Fine;
