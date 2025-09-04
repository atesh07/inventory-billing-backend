const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  businessName: { type: String, required: true }
}, { timestamps: true });

userSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
