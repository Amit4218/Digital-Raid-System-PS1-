import mongoose from "mongoose";

const blackListedToken = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlackListedToken = mongoose.model("black_Listed_token", blackListedToken);

export default BlackListedToken;
