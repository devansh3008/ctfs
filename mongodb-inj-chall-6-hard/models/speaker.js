const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema({
  name: String,
  title: String,
  company: String,
  image: String,
  bio: String,
  isAdmin: { type: Boolean, default: false },
  presentations: [String],
  secretKey: { type: String, select: false },
  hidden: { type: Boolean, default: false },
  internalNotes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Speaker", speakerSchema);
