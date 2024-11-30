#!/bin/bash

print_separator() {
    echo "=============================================="
}

# Admin login
echo "Logging in as admin..."
ADMIN_CREDENTIALS='{"username":"admin","password":"adminpass"}'
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d "$ADMIN_CREDENTIALS" | jq -r .token)

if [ "$ADMIN_TOKEN" == "null" ]; then
  echo "Admin login failed. Please check credentials."
  exit 1
fi

echo "Admin logged in successfully. Token received: $ADMIN_TOKEN"
print_separator

# User login
echo "Logging in as user..."
USER_CREDENTIALS='{"username":"user","password":"userpass"}'
USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d "$USER_CREDENTIALS" | jq -r .token)

if [ "$USER_TOKEN" == "null" ]; then
  echo "User login failed. Please check credentials."
  exit 1
fi

echo "User logged in successfully. Token received: $USER_TOKEN"
print_separator

# Create a Product
echo "Creating a new product..."
NEW_PRODUCT='{
  "name": "Laptop",
  "price": 1000,
  "description": "A high-performance laptop",
  "stock": 10
}'
PRODUCT=$(curl -s -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-d "$NEW_PRODUCT")

PRODUCT_ID=$(echo $PRODUCT | jq -r .id)

if [ "$PRODUCT_ID" == "null" ]; then
  echo "Failed to create product."
  exit 1
fi

echo "Product created successfully. Product ID: $PRODUCT_ID"
print_separator

# Get All Products
echo "Fetching all products..."
curl -X GET http://localhost:3000/api/products
print_separator

# Get Product by ID
echo "Fetching product by ID: $PRODUCT_ID..."
curl -X GET http://localhost:3000/api/products/$PRODUCT_ID
print_separator

# Update a Product (Full Update)
echo "Updating product with ID: $PRODUCT_ID..."
UPDATED_PRODUCT='{"name":"Gaming Laptop","price":1200,"description":"Updated laptop specs"}'
curl -X PUT http://localhost:3000/api/products/$PRODUCT_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-d "$UPDATED_PRODUCT"
print_separator

# Partial Update a Product
echo "Partially updating product with ID: $PRODUCT_ID..."
PARTIAL_UPDATE='{"price":1100}'
curl -X PATCH http://localhost:3000/api/products/$PRODUCT_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-d "$PARTIAL_UPDATE"
print_separator

# Order endpoints
# Create an Order
echo "Creating an order for product ID: $PRODUCT_ID..."
NEW_ORDER='{"products":[{"productId":"'$PRODUCT_ID'","quantity":2}]}'
ORDER=$(curl -s -X POST http://localhost:3000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN" \
-d "$NEW_ORDER")

ORDER_ID=$(echo $ORDER | jq -r .id)

if [ "$ORDER_ID" == "null" ]; then
  echo "Failed to create order."
  exit 1
fi

echo "Order created successfully. Order ID: $ORDER_ID"
print_separator

# Get All Orders
echo "Fetching all orders..."
curl -X GET http://localhost:3000/api/orders \
-H "Authorization: Bearer $USER_TOKEN"
print_separator

# Get Order by ID
echo "Fetching order with ID: $ORDER_ID..."
curl -X GET http://localhost:3000/api/orders/$ORDER_ID \
-H "Authorization: Bearer $USER_TOKEN"
print_separator

# Update an Order (Full Update)
echo "Updating order with ID: $ORDER_ID..."
UPDATED_ORDER='{"products":[{"productId":"'$PRODUCT_ID'","quantity":3}]}'
curl -X PUT http://localhost:3000/api/orders/$ORDER_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN" \
-d "$UPDATED_ORDER"
print_separator

# Partial Update Order
echo "Partially updating order with ID: $ORDER_ID..."
PARTIAL_ORDER_UPDATE='{"products":[{"productId":"'$PRODUCT_ID'","quantity":4}]}'
curl -X PATCH http://localhost:3000/api/orders/$ORDER_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $USER_TOKEN" \
-d "$PARTIAL_ORDER_UPDATE"
print_separator

# Delete an Order
echo "Deleting order with ID: $ORDER_ID..."
curl -X DELETE http://localhost:3000/api/orders/$ORDER_ID \
-H "Authorization: Bearer $USER_TOKEN"
print_separator

# Access a Protected Route Without a Token
echo "Attempting to access a protected route without a token..."
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-d '{"name":"Unauthorized","price":500,"description":"This should fail"}'
print_separator

# Access a Protected Route With Invalid Token
echo "Attempting to access a protected route with an invalid token..."
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer invalid_token" \
-d '{"name":"Unauthorized","price":500,"description":"This should fail"}'
print_separator

echo "End-to-end API tests completed."


# Delete a Product
echo "Deleting product with ID: $PRODUCT_ID..."
curl -X DELETE http://localhost:3000/api/products/$PRODUCT_ID \
-H "Authorization: Bearer $ADMIN_TOKEN"
print_separator
