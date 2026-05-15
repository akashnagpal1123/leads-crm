const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  leadSource: String,
  contactName: String,
  organisationName: String,
  gst: Boolean,
  phone: String,

  location: {
    country: String,
    state: String,
    city: String
  },

  stage: String,
  status: String,

  product: {
    subject: String,
    description: String
  },

  budget: {
    quantity: Number,
    unit: String
  },

  timestamps: {
    createdAt: Date,
    lastUpdate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);