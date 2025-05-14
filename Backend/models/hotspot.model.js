import moongoose from "mongoose";

const hotspotSchema = new moongoose.Schema(
  {
    location: {
      // GeoJSON
      type: "Point",
      coordinates: [longitude, latitude],
    },
    address: String,
    raidCount: Number,
    lastRaidDate: Date,
    commonViolations: [String],
    severityLevel: String, // 'high', 'medium', 'low'
    notes: String,
  },
  { timestamps: true }
);

const Hotspot = moongoose.model("hotspot", hotspotSchema);
export default Hotspot;
