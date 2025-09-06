# Inventory & Billing Backend (Express + MongoDB)

A simple backend for small businesses to manage products, contacts (customers/vendors), and transactions. JWT-based auth with each user's data siloed by `businessId` (user id).

## Tech
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken), bcrypt, dotenv, cors, morgan
- Minimal controllers/routes with basic validation & error handling

🚀 Live Demo
Backend API deployed on Render:
👉 https://inventory-billing-backend-g8kp.onrender.com

## 🎥 Project Introduction  

To get an overview of the Inventory Billing Backend and its features, you can watch the introduction video here:  

[![Watch the Introduction Video](https://img.youtube.com/vi/QJl6bUMy6-4/0.jpg)](https://youtu.be/QJl6bUMy6-4?si=rB8D3DyKQ_P-_7p_)

## Run Locally
```
Step are given below
git clone <https://github.com/atesh07/inventory-billing-backend>
npm install
Paste in terminal (for Mac)---------->
export NODE_ENV=development 
Paste in terminal (for Win)---------->
set NODE_ENV=development 
npm run seed
npm run dev
```
Make sure MongoDB is running (local or Atlas).

## .ENV
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

Here’s a clean, professional, and well-structured version of your instructions for a **GitHub README**:

---

# Inventory & Billing API — Quick Start

This guide walks you through testing the **Inventory & Billing API** using `curl`. Follow the steps below to register, authenticate, and interact with the server.

---

## 0️⃣ Check Server Status

Verify the server is running:

```bash
curl http://localhost:4000/
# Expected response: {"status":"ok"}
```

---

## 1️⃣ Register (Optional)

If you don’t have a user yet, register a new account:

```bash
curl -s -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "username":"newuser",
    "businessName":"My Shop",
    "password":"demo123"
  }'
```

> Response includes a JWT token and user details. If you already seeded a user, skip this step.

---

## 2️⃣ Login and Get JWT Token

### Manual:

Copy the token string from the response:

```bash
export TOKEN="eyJ...paste_here..."
```

### Automatic (requires `jq`):

```bash
export TOKEN=$(curl -s -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"demo123"}' | jq -r '.token')
echo $TOKEN
```

---

## 3️⃣ Verify Protected Route

Check that authenticated routes work:

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/products | jq .
```

---

## 4️⃣ Create a Product

```bash
export PRODUCT_ID=$(curl -s -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Notebook",
    "description":"A5 ruled",
    "price":50,
    "stock":100,
    "category":"Stationery"
  }' | jq -r '._id')
echo $PRODUCT_ID
```

> Or list existing products:

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/products | jq .
```

---

## 5️⃣ Create a Contact (Customer)

```bash
export CONTACT_ID=$(curl -s -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"John Customer",
    "type":"customer",
    "email":"john@x.com",
    "phone":"9999999999",
    "address":"City"
  }' | jq -r '._id')
echo $CONTACT_ID
```

> Or list contacts:

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/contacts | jq .
```

---

## 6️⃣ Create a Sale Transaction

Decrease product stock by creating a sale:

```bash
curl -s -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"sale",
    "customerId":"'"$CONTACT_ID"'",
    "products":[{"productId":"'"$PRODUCT_ID"'","quantity":2,"price":50}],
    "date":"2025-09-05"
  }' | jq .
```

> Verify `totalAmount` and updated stock.

---

## 7️⃣ Create a Purchase Transaction

Increase stock by creating a purchase:

```bash
curl -s -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"purchase",
    "vendorId":"'"$CONTACT_ID"'",
    "products":[{"productId":"'"$PRODUCT_ID"'","quantity":20,"price":40}]
  }' | jq .
```

---

## 8️⃣ List Transactions

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/transactions | jq .
```

> Filter by type/date:

```bash
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/transactions?type=sale&from=2025-01-01&to=2025-12-31" | jq .
```

---

## 9️⃣ Check Inventory

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/reports/inventory | jq .
```

> Confirms stock changes after sale/purchase.

---

## 🔟 Update / Delete Examples

### Update Product:

```bash
curl -s -X PUT http://localhost:4000/api/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price":60,"stock":150}' | jq .
```

### Delete Contact:

```bash
curl -s -X DELETE http://localhost:4000/api/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 1️⃣1️⃣ Logout (Client-Side)

```bash
curl -s -X GET http://localhost:4000/api/logout -H "Authorization: Bearer $TOKEN" | jq .
unset TOKEN
```

> Or clear your token in Postman.

---

## 1️⃣2️⃣ Login Again (Fresh Token)

```bash
export TOKEN=$(curl -s -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"demo123"}' | jq -r '.token')
echo $TOKEN
```


