const Contact = require('../models/Contact');

exports.list = async (req, res, next) => {
  try {
    const { q, type } = req.query;
    const filter = { businessId: req.user.id };
    if (type) filter.type = type;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body, businessId: req.user.id };
    const contact = await Contact.create(payload);
    res.status(201).json(contact);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Contact.findOneAndUpdate(
      { _id: id, businessId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Contact not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findOneAndDelete({ _id: id, businessId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
