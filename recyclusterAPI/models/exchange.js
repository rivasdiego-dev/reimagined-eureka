const mongoose = require("mongoose");
const { getObjId } = require("../utils/generalFunctions");

const Schema = mongoose.Schema;
const ExchangeSchema = new Schema(
  {
    id: {
      type: String
    },
    user_id: {
      type: String,
      required: true
    },
    post_id: {
      type: String,
      required: true
    },
    req_description: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    materials: {
      type: String,
      default: ""
    },
    steps: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    likes: {
      type: Array,
      default: []
    },
    status: {
      type: Number,
      default: 1
    },
    visibility: {
      type: Number,
      default: 1,
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

// Save id as string
ExchangeSchema.pre("save", async function (next) {
  const exchange = this;
  exchange.id = getObjId(exchange._id);
  
  next();
});

const ExchangeModel = mongoose.model("exchange", ExchangeSchema);

module.exports = ExchangeModel;