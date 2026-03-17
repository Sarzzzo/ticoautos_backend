const mongoose = require("mongoose");
//
const vehicleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["available", "sold"], default: "available" },
    description: { type: String },
    image: { type: String, default: '' },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
