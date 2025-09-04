# Inventory & Billing Backend (Express + MongoDB)

A simple backend for small businesses to manage products, contacts (customers/vendors), and transactions. JWT-based auth with each user's data siloed by `businessId` (user id).

## Tech
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken), bcrypt, dotenv, cors, morgan
- Minimal controllers/routes with basic validation & error handling

## Run Locally
```
git clone <https://github.com/atesh07/inventory-billing-backend>
cd inventory-billing-backend
cp .env
npm install
npm run seed
npm run dev
```
Make sure MongoDB is running (local or Atlas).

## ENV
```
PORT=4000
MONGODB_URI=mongodb+srv://ehtesham007:123123123@inventory-billing-backe.zquxqln.mongodb.net/inventory?retryWrites=true&w=majority&appName=inventory-billing-backend
JWT_SECRET=supersecretjwtkey

```

## API
Base URL: `/api`

### Auth
- `POST /api/register` → `{ email, password, username?, businessName }`
- `POST /api/login` → `{ email or username, password }` → returns `{ token, user }`
- `GET /api/logout` → stateless (client should discard token)

### Products
- `GET /api/products?q=&category=`
- `POST /api/products` → `{ name, description?, price, stock, category? }`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Contacts (Customers & Vendors)
- `GET /api/contacts?q=&type=customer|vendor`
- `POST /api/contacts` → `{ name, phone?, email?, address?, type: 'customer'|'vendor' }`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`

### Transactions
- `GET /api/transactions?type=sale|purchase&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/transactions`
```json
{
  "type": "sale",
  "customerId": "<contactId>",
  "products": [
    { "productId": "<id>", "quantity": 2, "price": 50 }
  ],
  "date": "2025-09-05"
}
```
For purchases, use `type: "purchase"` and `vendorId`.

### Reports
- `GET /api/reports/inventory`
- `GET /api/reports/transactions?type=&from=&to=`

## Notes
- All protected routes need `Authorization: Bearer <token>` header.
- Stock updates automatically on transaction create:
  - `sale` → stock decreases
  - `purchase` → stock increases
- No complex aggregation here; kept simple & readable.

## Demo Data
Seed demo user, products, and contacts:
```bash
npm run seed
```
Login with `demo@example.com` / `demo123`.



