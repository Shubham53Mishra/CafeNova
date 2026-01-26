# Cafe Registration Testing Guide

## Step 1: Vendor Registration & Login

### Register as Vendor
```bash
curl -X POST http://localhost:8000/api/vendor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cafe Owner",
    "email": "vendor@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "user": {
    "id": 1,
    "name": "Cafe Owner",
    "email": "vendor@example.com"
  },
  "token": "1|YOUR_TOKEN_HERE"
}
```

### Login as Vendor
```bash
curl -X POST http://localhost:8000/api/vendor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "1|YOUR_TOKEN_HERE"
}
```

Save the token for next requests.

---

## Step 2: Register Cafe (Full Details)

```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE" \
  -d '{
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop in the city with cozy ambiance",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Cafe registered successfully",
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop in the city with cozy ambiance",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "latitude": 40.7128,
    "longitude": -74.006,
    "updated_at": "2026-01-26T10:30:00.000000Z",
    "created_at": "2026-01-26T10:30:00.000000Z"
  }
}
```

---

## Step 3: Register Cafe (Minimal Details)

```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE" \
  -d '{
    "cafe_name": "Quick Cafe"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Cafe registered successfully",
  "cafe": {
    "id": 2,
    "vendor_id": 1,
    "cafe_name": "Quick Cafe",
    "cafe_description": null,
    "address": null,
    "city": null,
    "state": null,
    "pincode": null,
    "latitude": null,
    "longitude": null,
    "updated_at": "2026-01-26T10:31:00.000000Z",
    "created_at": "2026-01-26T10:31:00.000000Z"
  }
}
```

---

## Step 4: Test Error Cases

### Missing cafe_name (Required field)
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE" \
  -d '{
    "cafe_description": "No name"
  }'
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

### Invalid Pincode (Not 6 digits)
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE" \
  -d '{
    "cafe_name": "Test Cafe",
    "pincode": "12345"
  }'
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

### Invalid Coordinates
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE" \
  -d '{
    "cafe_name": "Test Cafe",
    "latitude": 100,
    "longitude": 200
  }'
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "latitude": [
      "The latitude must be between -90 and 90."
    ],
    "longitude": [
      "The longitude must be between -180 and 180."
    ]
  }
}
```

### Missing Authentication Token
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Content-Type: application/json" \
  -d '{
    "cafe_name": "Test Cafe"
  }'
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Step 5: Get All Cafes

```bash
curl -X GET http://localhost:8000/api/vendor/cafes \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "cafes": [
    {
      "id": 1,
      "vendor_id": 1,
      "cafe_name": "Coffee Paradise",
      "cafe_description": "Best coffee shop in the city with cozy ambiance",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "pincode": "100001",
      "latitude": 40.7128,
      "longitude": -74.006,
      "created_at": "2026-01-26T10:30:00.000000Z",
      "updated_at": "2026-01-26T10:30:00.000000Z",
      "items": []
    },
    {
      "id": 2,
      "vendor_id": 1,
      "cafe_name": "Quick Cafe",
      "cafe_description": null,
      "address": null,
      "city": null,
      "state": null,
      "pincode": null,
      "latitude": null,
      "longitude": null,
      "created_at": "2026-01-26T10:31:00.000000Z",
      "updated_at": "2026-01-26T10:31:00.000000Z",
      "items": []
    }
  ]
}
```

---

## Step 6: Get Single Cafe

```bash
curl -X GET http://localhost:8000/api/vendor/cafe/1 \
  -H "Authorization: Bearer 1|YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop in the city with cozy ambiance",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "latitude": 40.7128,
    "longitude": -74.006,
    "created_at": "2026-01-26T10:30:00.000000Z",
    "updated_at": "2026-01-26T10:30:00.000000Z",
    "items": []
  }
}
```

---

## Running Tests via Command Line

### Run all cafe registration tests:
```bash
php artisan test tests/Feature/CafeRegistrationTest.php
```

### Run specific test:
```bash
php artisan test tests/Feature/CafeRegistrationTest.php --filter=test_cafe_registration_success
```

### Run tests with detailed output:
```bash
php artisan test tests/Feature/CafeRegistrationTest.php -v
```

### Generate test coverage:
```bash
php artisan test --coverage
```

---

## Using Postman

1. **Create new Collection:** "Cafe Registration Tests"
2. **Add Requests:**
   - POST: {{base_url}}/api/vendor/signup
   - POST: {{base_url}}/api/vendor/login
   - POST: {{base_url}}/api/vendor/cafe/register
   - GET: {{base_url}}/api/vendor/cafes
   - GET: {{base_url}}/api/vendor/cafe/1

3. **Set Environment Variables:**
   - base_url: http://localhost:8000
   - token: (paste token from login response)

4. **Add Pre-request Script to Login request:**
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.token);
   ```

5. **Use {{token}} in Authorization header** for other requests

---

## Validation Rules Summary

| Field | Rules |
|-------|-------|
| cafe_name | Required, String, Max 255 chars |
| cafe_description | Optional, String |
| address | Optional, String |
| city | Optional, String |
| state | Optional, String |
| pincode | Optional, Must be exactly 6 digits |
| latitude | Optional, Numeric, Between -90 and 90 |
| longitude | Optional, Numeric, Between -180 and 180 |

