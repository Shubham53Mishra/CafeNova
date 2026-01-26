# Vendor Login API - Postman Testing Guide

## 📋 Overview

The vendor login endpoint accepts **email OR mobile number** along with password. This is a flexible login system.

---

## Step 1: Setup Postman Environment

### Create Environment Variables
1. Open Postman → **Environments** (top left)
2. Click **Create Environment** or **+**
3. Name it: `Cafe Nova Dev`
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| base_url | http://localhost:8000 | http://localhost:8000 |
| vendor_token | empty | (auto-filled after login) |
| vendor_id | empty | (auto-filled after login) |

---

## Step 2: Vendor Signup (Create Test Account)

### Create Request
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/signup`
- **Headers:**
  ```
  Content-Type: application/json
  ```

### Request Body:
```json
{
  "name": "Shubham Cafe",
  "email": "vendor@cafenova.com",
  "phone": "9876543210",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "vendor": {
    "id": 1,
    "shop_name": "Shubham Cafe",
    "owner_name": "Shubham Cafe",
    "email": "vendor@cafenova.com",
    "mobile": "9876543210",
    "is_active": true,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z"
  },
  "token": "2|abcdefghijklmnopqrstuvwxyz1234567890"
}
```

---

## Step 3: Vendor Login - Using Email

### Create Request
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```

### Request Body (Login with Email):
```json
{
  "email_or_mobile": "vendor@cafenova.com",
  "password": "password123"
}
```

### Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "vendor": {
    "id": 1,
    "shop_name": "Shubham Cafe",
    "owner_name": "Shubham Cafe",
    "email": "vendor@cafenova.com",
    "mobile": "9876543210",
    "address": null,
    "city": null,
    "state": null,
    "pincode": null,
    "shop_type": null,
    "is_active": true,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z"
  },
  "token": "3|abcdefghijklmnopqrstuvwxyz1234567890"
}
```

### Save Token to Environment
Add **Pre-request Script** or **Tests** tab:
```javascript
var jsonData = pm.response.json();
pm.environment.set("vendor_token", jsonData.token);
pm.environment.set("vendor_id", jsonData.vendor.id);
```

---

## Step 4: Vendor Login - Using Mobile Number

### Request Body (Login with Mobile):
```json
{
  "email_or_mobile": "9876543210",
  "password": "password123"
}
```

✅ Same response as email login

---

## Step 5: Test Error Cases

### ❌ Wrong Password
```json
{
  "email_or_mobile": "vendor@cafenova.com",
  "password": "wrongpassword"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### ❌ Non-existent Email/Mobile
```json
{
  "email_or_mobile": "nonexistent@test.com",
  "password": "password123"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### ❌ Inactive Vendor Account
```json
{
  "email_or_mobile": "vendor@cafenova.com",
  "password": "password123"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Vendor account is inactive"
}
```

---

### ❌ Missing Fields
```json
{
  "password": "password123"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "email_or_mobile": [
      "The email or mobile field is required."
    ]
  }
}
```

---

## Step 6: Test Protected Route (Using Token)

### Test with Login Token
- **Method:** `GET`
- **URL:** `{{base_url}}/api/vendor/profile`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: application/json
  ```

### Response (200):
```json
{
  "success": true,
  "vendor": {
    "id": 1,
    "shop_name": "Shubham Cafe",
    "owner_name": "Shubham Cafe",
    "email": "vendor@cafenova.com",
    "mobile": "9876543210",
    "is_active": true,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z"
  }
}
```

---

## Step 7: Complete Postman Collection

### Import this JSON into Postman

```json
{
  "info": {
    "name": "Cafe Nova - Vendor Auth",
    "description": "Vendor Authentication APIs"
  },
  "item": [
    {
      "name": "Vendor Signup",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Shubham Cafe\",\n  \"email\": \"vendor@cafenova.com\",\n  \"phone\": \"9876543210\",\n  \"password\": \"password123\",\n  \"password_confirmation\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/vendor/signup",
          "host": ["{{base_url}}"],
          "path": ["api", "vendor", "signup"]
        }
      }
    },
    {
      "name": "Vendor Login - Email",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email_or_mobile\": \"vendor@cafenova.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/vendor/login",
          "host": ["{{base_url}}"],
          "path": ["api", "vendor", "login"]
        }
      }
    },
    {
      "name": "Vendor Login - Mobile",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email_or_mobile\": \"9876543210\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/vendor/login",
          "host": ["{{base_url}}"],
          "path": ["api", "vendor", "login"]
        }
      }
    },
    {
      "name": "Get Vendor Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{vendor_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/vendor/profile",
          "host": ["{{base_url}}"],
          "path": ["api", "vendor", "profile"]
        }
      }
    }
  ]
}
```

---

## Testing Checklist

- [ ] Signup vendor with valid data
- [ ] Login with email
- [ ] Login with mobile number
- [ ] Get profile using token
- [ ] Test wrong password
- [ ] Test non-existent account
- [ ] Test missing fields
- [ ] Verify token is saved to environment

---

## cURL Commands (Alternative)

### Signup:
```bash
curl -X POST http://localhost:8000/api/vendor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shubham Cafe",
    "email": "vendor@cafenova.com",
    "phone": "9876543210",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/vendor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_or_mobile": "vendor@cafenova.com",
    "password": "password123"
  }'
```

### Get Profile (with token):
```bash
curl -X GET http://localhost:8000/api/vendor/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Key Points

✅ **email_or_mobile** field accepts both email and mobile  
✅ Token is returned on successful login  
✅ Use token in Authorization header for protected routes  
✅ Check vendor **is_active** status before allowing login  
✅ Passwords are hashed using bcrypt  

