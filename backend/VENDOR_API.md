# Vendor API Documentation

## Base URL
```
http://localhost/api/vendor
```

## Authentication
Token-based authentication using Bearer tokens (Sanctum)

---

## 1. Vendor Signup

**Endpoint:** `POST /vendor/signup`

**Description:** Register a new vendor account

**Request Body:**
```json
{
  "shop_name": "My Coffee Shop",
  "owner_name": "John Doe",
  "email": "vendor@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "password_confirmation": "password123",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pincode": "100001",
  "shop_type": "Coffee Shop"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "vendor": {
    "id": 1,
    "shop_name": "My Coffee Shop",
    "owner_name": "John Doe",
    "email": "vendor@example.com",
    "mobile": "9876543210",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "shop_type": "Coffee Shop",
    "is_active": true,
    "created_at": "2026-01-21T12:30:00Z",
    "updated_at": "2026-01-21T12:30:00Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}
```

**Response (Error - 422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "email": ["The email has already been taken."],
    "shop_name": ["The shop name has already been taken."]
  }
}
```

---

## 2. Vendor Login

**Endpoint:** `POST /vendor/login`

**Description:** Login with vendor email and password

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "vendor": {
    "id": 1,
    "shop_name": "My Coffee Shop",
    "owner_name": "John Doe",
    "email": "vendor@example.com",
    "mobile": "9876543210",
    "is_active": true,
    "created_at": "2026-01-21T12:30:00Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 3. Get Vendor Profile

**Endpoint:** `GET /vendor/profile`

**Description:** Get logged-in vendor's profile information

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "vendor": {
    "id": 1,
    "shop_name": "My Coffee Shop",
    "owner_name": "John Doe",
    "email": "vendor@example.com",
    "mobile": "9876543210",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "shop_type": "Coffee Shop",
    "is_active": true,
    "created_at": "2026-01-21T12:30:00Z",
    "updated_at": "2026-01-21T12:30:00Z"
  }
}
```

---

## 4. Update Vendor Profile

**Endpoint:** `PUT /vendor/profile`

**Description:** Update vendor profile information

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "owner_name": "John Updated",
  "address": "456 New Street",
  "city": "Los Angeles",
  "state": "CA",
  "pincode": "900001",
  "shop_type": "Premium Coffee Shop"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "vendor": {
    "id": 1,
    "shop_name": "My Coffee Shop",
    "owner_name": "John Updated",
    "email": "vendor@example.com",
    "mobile": "9876543210",
    "address": "456 New Street",
    "city": "Los Angeles",
    "state": "CA",
    "pincode": "900001",
    "shop_type": "Premium Coffee Shop",
    "is_active": true,
    "updated_at": "2026-01-21T13:00:00Z"
  }
}
```

---

## 5. Vendor Logout

**Endpoint:** `POST /vendor/logout`

**Description:** Logout and invalidate current token

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 422 - Validation Error
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 - Inactive Account
```json
{
  "success": false,
  "message": "Vendor account is inactive"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error: {error_details}"
}
```

---

## Testing with Postman/cURL

### Signup Example (cURL)
```bash
curl -X POST http://localhost/api/vendor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "My Coffee Shop",
    "owner_name": "John Doe",
    "email": "vendor@example.com",
    "mobile": "9876543210",
    "password": "password123",
    "password_confirmation": "password123",
    "city": "New York",
    "state": "NY",
    "shop_type": "Coffee Shop"
  }'
```

### Login Example (cURL)
```bash
curl -X POST http://localhost/api/vendor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "password123"
  }'
```

### Get Profile Example (cURL)
```bash
curl -X GET http://localhost/api/vendor/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Schema

### vendors table
| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | primary key |
| shop_name | string | unique |
| owner_name | string | |
| email | string | unique |
| mobile | string | unique |
| password | string | |
| address | text | nullable |
| city | string | nullable |
| state | string | nullable |
| pincode | string | nullable |
| shop_type | string | nullable |
| is_active | boolean | default: true |
| created_at | timestamp | |
| updated_at | timestamp | |

