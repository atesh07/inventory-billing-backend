const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authRequired = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = { id: user._id, businessName: user.businessName, email: user.email };
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

module.exports = { authRequired };
