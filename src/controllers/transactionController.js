const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

exports.list = async (req, res, next) => {
  try {
    const { type, from, to } = req.query;
    const filter = { businessId: req.user.id };
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const txns = await Transaction.find(filter).sort({ date: -1 }).populate('products.productId');
    res.json(txns);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { type, customerId, vendorId, products, date } = req.body;
    if (!type || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'type and products are required' });
    }

    // Calculate total
    let total = 0;
    for (const item of products) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each product must have productId, quantity, price' });
      }
      total += item.quantity * item.price;
    }

    // Update stock
    for (const item of products) {
      const product = await Product.findOne({ _id: item.productId, businessId: req.user.id });
      if (!product) return res.status(404).json({ error: `Product not found: ${item.productId}` });

      if (type === 'sale') {
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        product.stock -= item.quantity;
      } else if (type === 'purchase') {
        product.stock += item.quantity;
      }
      await product.save();
    }

    const txn = await Transaction.create({
      type,
      customerId: type === 'sale' ? customerId : undefined,
      vendorId: type === 'purchase' ? vendorId : undefined,
      products,
      totalAmount: total,
      date: date ? new Date(date) : new Date(),
      businessId: req.user.id
    });

    res.status(201).json(txn);
  } catch (err) { next(err); }
};
