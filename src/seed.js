require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_billing';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected');

    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Contact.deleteMany({})]);
    const user = new User({ email: 'demo@example.com', username: 'demo', businessName: 'Demo Biz' });
    await user.setPassword('demo123');
    await user.save();

    const businessId = user._id;

    await Product.insertMany([
      { name: 'Notebook', description: 'A5 ruled', price: 50, stock: 100, category: 'Stationery', businessId },
      { name: 'Pen', description: 'Blue ink', price: 10, stock: 500, category: 'Stationery', businessId }
    ]);

    await Contact.insertMany([
      { name: 'John Customer', type: 'customer', email: 'john@x.com', phone: '9999999999', address: 'City', businessId },
      { name: 'Acme Vendor', type: 'vendor', email: 'acme@x.com', phone: '8888888888', address: 'Town', businessId }
    ]);

    console.log('Seeded. Login with email demo@example.com / password demo123');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
