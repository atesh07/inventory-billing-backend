const Product = require('../models/Product');

exports.list = async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const filter = { businessId: req.user.id };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.create({
      name, description, price, stock, category, businessId: req.user.id
    });
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findOneAndUpdate(
      { _id: id, businessId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ _id: id, businessId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
