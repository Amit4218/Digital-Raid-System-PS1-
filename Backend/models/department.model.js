import mongoose from "mongoose";

const departmentSchema = mongoose.Schema(
  {
    departmentId: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("department", departmentSchema);

export default Department;
