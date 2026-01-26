# Cafe Registration API - Postman Testing Guide

## 📋 Overview

Vendor can register cafes after login. This endpoint requires:
- ✅ Authentication token (from login)
- ✅ Required fields: `cafe_name`, `latitude`, `longitude`
- ✅ Optional fields: description, address, city, state, pincode

---

## Step 1: Prerequisites

### You Need:
1. ✅ Vendor account (created & logged in)
2. ✅ Vendor authentication token
3. ✅ Environment variables setup in Postman

### Setup Environment Variables:
In Postman Environment (`Cafe Nova Dev`), add:

| Variable | Value |
|----------|-------|
| base_url | http://localhost:8000 |
| vendor_token | (from login response) |

---

## Step 2: Full Workflow

### Step 2.1: Create Vendor Account
**POST** `{{base_url}}/api/vendor/signup`

```json
{
  "name": "Coffee Master",
  "email": "coffeemaster@cafe.com",
  "phone": "9876543210",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "token": "1|abcdefghijklmnopqrstuvwxyz..."
}
```

👉 Save token to environment variable `vendor_token`

---

### Step 2.2: Login Vendor (Get Fresh Token)
**POST** `{{base_url}}/api/vendor/login`

```json
{
  "email_or_mobile": "coffeemaster@cafe.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "2|abcdefghijklmnopqrstuvwxyz..."
}
```

**Tests Tab Script:**
```javascript
var jsonData = pm.response.json();
pm.environment.set("vendor_token", jsonData.token);
pm.environment.set("vendor_id", jsonData.vendor.id);
```

---

## Step 3: Register Cafe (Full Details)

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/cafe/register`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: application/json
  ```

### Request Body (All Fields):
```json
{
  "cafe_name": "Coffee Paradise",
  "cafe_description": "Best coffee shop with cozy ambiance and free WiFi",
  "address": "123 MG Road",
  "city": "Bangalore",
  "state": "KA",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Cafe registered successfully",
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop with cozy ambiance and free WiFi",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "KA",
    "pincode": "560001",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "is_active": true,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z"
  }
}
```

**Save Cafe ID (Optional):**
```javascript
var jsonData = pm.response.json();
pm.environment.set("cafe_id", jsonData.cafe.id);
```

---

## Step 4: Register Cafe (Minimal Data)

### Request Body (Only Required):
```json
{
  "cafe_name": "Quick Coffee",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Cafe registered successfully",
  "cafe": {
    "id": 2,
    "vendor_id": 1,
    "cafe_name": "Quick Coffee",
    "cafe_description": null,
    "address": null,
    "city": null,
    "state": null,
    "pincode": null,
    "latitude": 28.6139,
    "longitude": 77.209,
    "is_active": true,
    "created_at": "2026-01-26T10:31:00.000000Z",
    "updated_at": "2026-01-26T10:31:00.000000Z"
  }
}
```

---

## Step 5: Test Error Cases

### ❌ Missing cafe_name (Required)
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "cafe_name": [
      "The cafe name field is required."
    ]
  }
}
```

---

### ❌ Missing latitude (Required)
```json
{
  "cafe_name": "Test Cafe",
  "longitude": 77.2090
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "latitude": [
      "The latitude field is required."
    ]
  }
}
```

---

### ❌ Missing longitude (Required)
```json
{
  "cafe_name": "Test Cafe",
  "latitude": 28.6139
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "longitude": [
      "The longitude field is required."
    ]
  }
}
```

---

### ❌ Invalid Latitude (Out of Range)
```json
{
  "cafe_name": "Test Cafe",
  "latitude": 100,
  "longitude": 77.2090
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "latitude": [
      "The latitude must be between -90 and 90."
    ]
  }
}
```

---

### ❌ Invalid Longitude (Out of Range)
```json
{
  "cafe_name": "Test Cafe",
  "latitude": 28.6139,
  "longitude": 200
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "longitude": [
      "The longitude must be between -180 and 180."
    ]
  }
}
```

---

### ❌ Invalid Pincode (Not 6 Digits)
```json
{
  "cafe_name": "Test Cafe",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "pincode": "12345"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "pincode": [
      "The pincode must be 6 digits."
    ]
  }
}
```

---

### ❌ Invalid Pincode (Correct Format)
```json
{
  "cafe_name": "Test Cafe",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "pincode": "560001"
}
```

✅ This works fine!

---

### ❌ Missing Authorization Token
**Remove the Authorization header and try**

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

### ❌ Invalid/Expired Token
```
Authorization: Bearer invalid_token_here
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Step 6: Get All Cafes for Vendor

### Request Details:
- **Method:** `GET`
- **URL:** `{{base_url}}/api/vendor/cafes`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: application/json
  ```

### Response (200):
```json
{
  "success": true,
  "cafes": [
    {
      "id": 1,
      "vendor_id": 1,
      "cafe_name": "Coffee Paradise",
      "cafe_description": "Best coffee shop with cozy ambiance",
      "address": "123 MG Road",
      "city": "Bangalore",
      "state": "KA",
      "pincode": "560001",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "is_active": true,
      "created_at": "2026-01-26T10:30:00.000000Z",
      "updated_at": "2026-01-26T10:30:00.000000Z",
      "items": []
    },
    {
      "id": 2,
      "vendor_id": 1,
      "cafe_name": "Quick Coffee",
      "cafe_description": null,
      "address": null,
      "city": null,
      "state": null,
      "pincode": null,
      "latitude": 28.6139,
      "longitude": 77.209,
      "is_active": true,
      "created_at": "2026-01-26T10:31:00.000000Z",
      "updated_at": "2026-01-26T10:31:00.000000Z",
      "items": []
    }
  ]
}
```

---

## Step 7: Get Single Cafe

### Request Details:
- **Method:** `GET`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  ```

### Response (200):
```json
{
  "success": true,
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop with cozy ambiance",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "KA",
    "pincode": "560001",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "is_active": true,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z",
    "items": []
  }
}
```

---

## Postman Collection Import

### JSON Collection:
```json
{
  "info": {
    "name": "Cafe Nova - Vendor Cafe Management",
    "description": "Cafe Registration and Management APIs"
  },
  "item": [
    {
      "name": "Vendor Signup",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {"mode": "raw", "raw": "{\"name\": \"Coffee Master\",\"email\": \"coffeemaster@cafe.com\",\"phone\": \"9876543210\",\"password\": \"password123\",\"password_confirmation\": \"password123\"}"},
        "url": {"raw": "{{base_url}}/api/vendor/signup", "host": ["{{base_url}}"], "path": ["api", "vendor", "signup"]}
      }
    },
    {
      "name": "Vendor Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {"mode": "raw", "raw": "{\"email_or_mobile\": \"coffeemaster@cafe.com\",\"password\": \"password123\"}"},
        "url": {"raw": "{{base_url}}/api/vendor/login", "host": ["{{base_url}}"], "path": ["api", "vendor", "login"]}
      }
    },
    {
      "name": "Register Cafe - Full Details",
      "request": {
        "method": "POST",
        "header": [{"key": "Authorization", "value": "Bearer {{vendor_token}}"}, {"key": "Content-Type", "value": "application/json"}],
        "body": {"mode": "raw", "raw": "{\"cafe_name\": \"Coffee Paradise\",\"cafe_description\": \"Best coffee shop with cozy ambiance\",\"address\": \"123 MG Road\",\"city\": \"Bangalore\",\"state\": \"KA\",\"pincode\": \"560001\",\"latitude\": 12.9716,\"longitude\": 77.5946}"},
        "url": {"raw": "{{base_url}}/api/vendor/cafe/register", "host": ["{{base_url}}"], "path": ["api", "vendor", "cafe", "register"]}
      }
    },
    {
      "name": "Register Cafe - Minimal",
      "request": {
        "method": "POST",
        "header": [{"key": "Authorization", "value": "Bearer {{vendor_token}}"}, {"key": "Content-Type", "value": "application/json"}],
        "body": {"mode": "raw", "raw": "{\"cafe_name\": \"Quick Coffee\",\"latitude\": 28.6139,\"longitude\": 77.2090}"},
        "url": {"raw": "{{base_url}}/api/vendor/cafe/register", "host": ["{{base_url}}"], "path": ["api", "vendor", "cafe", "register"]}
      }
    },
    {
      "name": "Get All Cafes",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{vendor_token}}"}, {"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "{{base_url}}/api/vendor/cafes", "host": ["{{base_url}}"], "path": ["api", "vendor", "cafes"]}
      }
    },
    {
      "name": "Get Single Cafe",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{vendor_token}}"}, {"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "{{base_url}}/api/vendor/cafe/{{cafe_id}}", "host": ["{{base_url}}"], "path": ["api", "vendor", "cafe", "{{cafe_id}}"]}
      }
    }
  ]
}
```

---

## Complete Testing Workflow

### 1️⃣ Vendor Signup
```
POST /api/vendor/signup
```

### 2️⃣ Vendor Login
```
POST /api/vendor/login
→ Save token to {{vendor_token}}
```

### 3️⃣ Register Cafe
```
POST /api/vendor/cafe/register
Header: Authorization: Bearer {{vendor_token}}
Body: cafe_name, latitude, longitude (required)
```

### 4️⃣ Get All Cafes
```
GET /api/vendor/cafes
Header: Authorization: Bearer {{vendor_token}}
```

### 5️⃣ Get Single Cafe
```
GET /api/vendor/cafe/{id}
Header: Authorization: Bearer {{vendor_token}}
```

---

## Validation Rules Summary

| Field | Rules | Example |
|-------|-------|---------|
| cafe_name | Required, String, Max 255 | "Coffee Paradise" |
| cafe_description | Optional, String | "Best coffee..." |
| address | Optional, String | "123 MG Road" |
| city | Optional, String | "Bangalore" |
| state | Optional, String | "KA" |
| pincode | Optional, 6 digits exactly | "560001" |
| latitude | **Required**, Numeric, -90 to 90 | 12.9716 |
| longitude | **Required**, Numeric, -180 to 180 | 77.5946 |

---

## cURL Commands (Alternative)

### Register Cafe:
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "KA",
    "pincode": "560001",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

### Get All Cafes:
```bash
curl -X GET http://localhost:8000/api/vendor/cafes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Quick Tips

✅ Always include `Authorization: Bearer {{vendor_token}}` header  
✅ `cafe_name`, `latitude`, `longitude` are **REQUIRED**  
✅ Latitude range: **-90 to +90**  
✅ Longitude range: **-180 to +180**  
✅ Pincode must be **exactly 6 digits** if provided  
✅ Save token from login to environment variable  
✅ Use `{{cafe_id}}` in URL after getting cafe ID  

