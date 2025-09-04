const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "supersecretjwtkey"; // fallback

const signToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken };
