const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  address: { type: String, trim: true },
  type: { type: String, enum: ['customer', 'vendor'], required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
