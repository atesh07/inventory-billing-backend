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

Here is all data which is use in postman ()-------------->

0) Quick check server is running
curl http://localhost:4000/
# Expect: {"status":"ok"}

1) Register (optional — use seed user if you already seeded)
curl -s -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","username":"newuser","businessName":"My Shop","password":"demo123"}'
Response includes token and user.

2) Login — get JWT token (store in shell variable)
Manual copy method: copy the token string from response and run:
export TOKEN="eyJ...paste_here..."
Automatic (if you have jq):
export TOKEN=$(curl -s -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"demo123"}' | jq -r '.token')
echo $TOKEN

3) Verify protected route works (products list)
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/products | jq .
# If no jq, just:
# curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/products

4) Create a product
curl -s -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Notebook","description":"A5 ruled","price":50,"stock":100,"category":"Stationery"}' | jq .
Save _id from response as PRODUCT_ID:
export PRODUCT_ID=$(curl -s -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Notebook","description":"A5 ruled","price":50,"stock":100,"category":"Stationery"}' | jq -r '._id')
echo $PRODUCT_ID
(If you already have products, you can list and pick one:
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/products | jq . 
)

5) Create a contact (customer)
curl -s -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"John Customer","type":"customer","email":"john@x.com","phone":"9999999999","address":"City"}' | jq .
Save CONTACT_ID:
export CONTACT_ID=$(curl -s -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"John Customer","type":"customer","email":"john@x.com","phone":"9999999999","address":"City"}' | jq -r '._id')
echo $CONTACT_ID
(Or list contacts:)
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/contacts | jq .

6) Create a SALE transaction (this will decrease product stock)
Important: server expects type and products array with productId, quantity, price. Server computes totalAmount automatically.
Use the IDs saved above:
curl -s -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"sale",
    "customerId":"'"$CONTACT_ID"'",
    "products":[
      {"productId":"'"$PRODUCT_ID"'","quantity":2,"price":50}
    ],
    "date":"2025-09-05"
  }' | jq .
Response: created transaction. Check that totalAmount is correct and stock updated.

7) Create a PURCHASE transaction (this will increase stock)
curl -s -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"purchase",
    "vendorId":"'"$CONTACT_ID"'",
    "products":[
      {"productId":"'"$PRODUCT_ID"'","quantity":20,"price":40}
    ]
  }' | jq .

8) List Transactions
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/transactions" | jq .
# Filter by type/date:
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/transactions?type=sale&from=2025-01-01&to=2025-12-31" | jq .

9) Check Inventory (report)
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/reports/inventory | jq .
You’ll see name, stock, price etc — confirm stock changed after sale/purchase.

10) Update / Delete examples
Update product
curl -s -X PUT http://localhost:4000/api/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price":60,"stock":150}' | jq .
Delete contact
curl -s -X DELETE http://localhost:4000/api/contacts/$CONTACT_ID \
  -H "Authorization: Bearer $TOKEN" | jq .

11) Logout (client-side)
Call logout (server returns message but token is not invalidated on server):
curl -s -X GET http://localhost:4000/api/logout -H "Authorization: Bearer $TOKEN" | jq .
# Then remove token locally:
unset TOKEN
# or in Postman clear environment variable {{token}}

12) Login again (to get a fresh token)
export TOKEN=$(curl -s -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"demo123"}' | jq -r '.token')
echo $TOKEN
Now you can continue testing with the new token.







