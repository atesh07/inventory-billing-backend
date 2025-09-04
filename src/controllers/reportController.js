const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.inventory = async (req, res, next) => {
  try {
    const products = await Product.find({ businessId: req.user.id })
      .select('name category stock price updatedAt')
      .sort({ name: 1 });
    res.json({ count: products.length, items: products });
  } catch (err) { next(err); }
};

exports.transactions = async (req, res, next) => {
  try {
    const { type, from, to } = req.query;
    const filter = { businessId: req.user.id };
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const txns = await Transaction.find(filter).sort({ date: -1 });
    res.json({ count: txns.length, items: txns });
  } catch (err) { next(err); }
};
