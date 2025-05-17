import mongoose from "mongoose";

const CriminalSchema = mongoose.Schema(
  {
    criminalId: {     // probably their aadhar Id
      type: String,
      required: true,
    },
    criminalName: {
      type: String,
      required: true,
    },
    pastRecords: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Crimainal = mongoose.model("crimainal", CriminalSchema);

export default Crimainal;
