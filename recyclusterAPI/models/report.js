const mongoose = require("mongoose");
const { getObjId } = require("../utils/generalFunctions");

const Schema = mongoose.Schema;
const ReportSchema = new Schema(
  {
    id: {
      type: String
    },
    target_id: {
        type: String,
        required: true
      },
    user_id: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    frequency: {
      type: Array,
      default: []
    },
    status: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

// Save id as string
ReportSchema.pre("save", async function (next) {
  const report = this;
  report.id = getObjId(report._id);
  
  next();
});

const ReportModel = mongoose.model("report", ReportSchema);

module.exports = ReportModel;