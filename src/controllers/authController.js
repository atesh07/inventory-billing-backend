const User = require('../models/User');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
  try {
    const { email, password, username, businessName } = req.body;
    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'email, password, businessName are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = new User({ email, username, businessName });
    await user.setPassword(password);
    await user.save();

    const token = signToken({ sub: user._id, businessId: user._id });
    res.status(201).json({ token, user: { id: user._id, email: user.email, businessName: user.businessName } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!password || (!email && !username)) {
      return res.status(400).json({ error: 'Provide email or username and password' });
    }
    const user = await User.findOne(email ? { email } : { username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ sub: user._id, businessId: user._id });
    res.json({ token, user: { id: user._id, email: user.email, businessName: user.businessName } });
  } catch (err) { next(err); }
};

exports.logout = async (req, res) => {
  // With JWT, logout is handled client-side by discarding the token.
  res.json({ message: 'Logged out (client should discard token)' });
};
