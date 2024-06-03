const mongoose = require("mongoose");
const Activities = require("./Activities");

const landmarkSchema = new mongoose.Schema({
  image: String,
  name: String,
  description: String,
  type: String,
  city: { type: mongoose.SchemaTypes.ObjectId, ref: "Cities" },
  activities: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Activities" }],
  website: String,
  contact: Number,
});

const Landmarks = mongoose.model("Landmarks", landmarkSchema);
module.exports = Landmarks;
