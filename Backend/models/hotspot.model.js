import moongoose from "mongoose";

const hotspotSchema = new moongoose.Schema(
  {
    location: {
      // GeoJSON
      coordinates: {
        longitude: {
          type: String,
          required: true,
        },
        latitude: {
          type: String,
          required: true,
        },
      },
    },
    address: {
      type: String,
      required: true,
    },
    raidCount: {
      type: String,
      required: true,
    },
    lastRaidDate: {
      type: Date,
      default: null,
    },
    commonViolations: [String],
    severityLevel: {
      type: String,
      enum: ["High", "medium", "low"],
      required: true,
    }, // 'high', 'medium', 'low'
    notes: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Hotspot = moongoose.model("hotspot", hotspotSchema);
export default Hotspot;
