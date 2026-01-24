# Vendor CafeNova Integration Guide

This guide explains how to integrate vendor signup and login with the external CafeNova API (https://cafenova.onrender.com).

## Overview

The vendor authentication system now supports:
1. **Local Authentication** - Traditional signup/login with local database
2. **External CafeNova Integration** - Signup and login via the CafeNova API with automatic local account synchronization

## API Endpoints

### Local Vendor Authentication (Existing)

#### Signup (Local)
```
POST /api/vendor/signup
Content-Type: application/json

{
  "shop_name": "My Coffee Shop",
  "owner_name": "John Doe",
  "email": "vendor@example.com",
  "mobile": "9876543210",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "shop_type": "Cafe"
}
```

#### Login (Local)
```
POST /api/vendor/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "SecurePass123"
}
```

---

### External CafeNova Integration (New)

#### 1. Signup via CafeNova
```
POST /api/vendor/signup-external
Content-Type: application/json

{
  "shop_name": "My Coffee Shop",
  "owner_name": "John Doe",
  "email": "vendor@example.com",
  "mobile": "9876543210",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "shop_type": "Cafe"
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
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "shop_type": "Cafe",
    "is_active": true,
    "created_at": "2026-01-23T10:00:00.000000Z"
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz...",
  "external_response": {
    "success": true,
    "message": "Vendor registered successfully",
    "vendor": {...},
    "token": "external_token_from_cafenova"
  }
}
```

**Response (Error - 422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

#### 2. Login via CafeNova
```
POST /api/vendor/login-external
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "SecurePass123"
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
    "is_active": true
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz...",
  "external_response": {
    "success": true,
    "message": "Login successful",
    "vendor": {...},
    "token": "external_token_from_cafenova"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials or external service error",
  "error": {
    "success": false,
    "message": "Invalid email or password"
  }
}
```

---

#### 3. Verify External Token
```
POST /api/vendor/verify-external-token
Content-Type: application/json

{
  "external_token": "external_token_from_cafenova"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token verified successfully",
  "vendor": {
    "id": 1,
    "shop_name": "My Coffee Shop",
    "owner_name": "John Doe",
    "email": "vendor@example.com",
    "is_active": true
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

---

#### 4. Check External Service Status
```
GET /api/vendor/check-external-service
```

**Response (Success):**
```json
{
  "success": true,
  "message": "External service is online",
  "status": 200
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "External service is unreachable: cURL error 28: Operation timed out"
}
```

---

## How It Works

### External Signup Flow
1. User submits vendor signup form via `/api/vendor/signup-external`
2. Backend validates input data
3. Backend calls CafeNova API endpoint: `POST https://cafenova.onrender.com/api/vendor/signup`
4. If CafeNova registration succeeds:
   - Vendor data is saved to local database
   - Local authentication token is generated
   - Both local and external tokens are returned
5. Client can use either token for subsequent requests

### External Login Flow
1. User submits login credentials via `/api/vendor/login-external`
2. Backend calls CafeNova API endpoint: `POST https://cafenova.onrender.com/api/vendor/login`
3. If CafeNova authentication succeeds:
   - If vendor exists locally, return their data
   - If vendor is new, create local account with CafeNova data
   - Local authentication token is generated
4. Client receives local token for accessing your API

### Key Features
- **Automatic Synchronization**: Vendor data is synced between systems
- **Dual Authentication**: Support for both local and external tokens
- **Error Handling**: Graceful fallbacks if external service is unavailable
- **Account Creation**: Automatic local account creation on first CafeNova login
- **Account Activation**: Vendors are automatically activated on successful external login

---

## Protected Vendor Routes (Require Authentication)

All these routes require a valid token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Profile Management
```
GET /api/vendor/profile              # Get current vendor profile
PUT /api/vendor/profile              # Update vendor profile
POST /api/vendor/logout              # Logout (invalidates all tokens)
```

### Cafe Management
```
POST /api/vendor/cafe/register       # Register a cafe
GET /api/vendor/cafes                # List vendor's cafes
GET /api/vendor/cafe/{cafeId}        # Get specific cafe
PUT /api/vendor/cafe/{cafeId}        # Update cafe
DELETE /api/vendor/cafe/{cafeId}     # Delete cafe
```

### Item Management
```
POST /api/vendor/cafe/{cafeId}/item/add           # Add menu item
GET /api/vendor/cafe/{cafeId}/items               # List cafe items
GET /api/vendor/cafe/{cafeId}/item/{itemId}       # Get item details
PUT /api/vendor/cafe/{cafeId}/item/{itemId}       # Update item
DELETE /api/vendor/cafe/{cafeId}/item/{itemId}    # Delete item
```

### Subitem Management
```
POST /api/vendor/cafe/{cafeId}/item/{itemId}/subitem/add
GET /api/vendor/cafe/{cafeId}/item/{itemId}/subitems
GET /api/vendor/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}
PUT /api/vendor/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}
DELETE /api/vendor/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}
```

---

## Frontend Integration Example (React)

### Signup via CafeNova
```javascript
const signupWithCafeNova = async (vendorData) => {
  try {
    const response = await fetch('https://your-api.com/api/vendor/signup-external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData)
    });

    const data = await response.json();
    
    if (data.success) {
      // Store token in localStorage
      localStorage.setItem('vendorToken', data.token);
      localStorage.setItem('vendor', JSON.stringify(data.vendor));
      
      // Store external token if needed
      localStorage.setItem('externalToken', data.external_response.token);
      
      // Redirect to dashboard
      navigate('/vendor/dashboard');
    } else {
      alert('Signup failed: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Login via CafeNova
```javascript
const loginWithCafeNova = async (email, password) => {
  try {
    const response = await fetch('https://your-api.com/api/vendor/login-external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('vendorToken', data.token);
      localStorage.setItem('vendor', JSON.stringify(data.vendor));
      navigate('/vendor/dashboard');
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Protected API Call
```javascript
const getVendorProfile = async () => {
  const token = localStorage.getItem('vendorToken');
  
  const response = await fetch('https://your-api.com/api/vendor/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.vendor;
};
```

---

## Error Handling

### Common Error Codes
- **422 Validation Error** - Input validation failed
- **401 Unauthorized** - Invalid credentials or missing/expired token
- **403 Forbidden** - Account is inactive
- **500 Internal Server Error** - Server error
- **503 Service Unavailable** - External service is unreachable

### Handling Timeouts
If CafeNova service is slow or unreachable:
- Default timeout: 30 seconds
- Returns error response with appropriate status code
- Fallback to local authentication is supported

---

## Security Notes

1. **Always use HTTPS** in production
2. **Never expose tokens** in logs or error messages
3. **Store tokens securely** in httpOnly cookies or secure storage
4. **Validate data** on both frontend and backend
5. **Rate limit** authentication endpoints to prevent brute force
6. **Monitor** external API calls for security issues

---

## Testing

You can test the endpoints using curl or Postman:

### Test Signup
```bash
curl -X POST http://localhost:8000/api/vendor/signup-external \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Test Shop",
    "owner_name": "Test Owner",
    "email": "test@example.com",
    "mobile": "1234567890",
    "password": "TestPass123",
    "password_confirmation": "TestPass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/vendor/login-external \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Service Status
```bash
curl http://localhost:8000/api/vendor/check-external-service
```

---

## Troubleshooting

### External Service Connection Issues
- Check if CafeNova URL is correct: `https://cafenova.onrender.com`
- Ensure your server has internet access
- Check network firewall rules
- Verify CORS settings if calling from browser

### Token Issues
- Tokens expire after a certain period (check your Sanctum config)
- Create a new token by logging in again
- Clear browser cache/localStorage if token persists

### Account Already Exists
- If email already exists in local system, update operation occurs instead of create
- This prevents duplicate accounts

---

## Files Modified/Created

1. **Created**: `app/Http/Controllers/VendorExternalAuthController.php`
   - New controller for external API integration

2. **Updated**: `routes/api.php`
   - Added 4 new external auth endpoints
   - Added import for new controller

3. **Existing**: `app/Models/Vendor.php`
   - No changes needed (already configured)

4. **Existing**: `app/Http/Controllers/VendorAuthController.php`
   - Local auth remains unchanged
   - Works alongside external auth

---

## Support

For issues with CafeNova integration, check:
- CafeNova API documentation
- Laravel Sanctum documentation
- HTTP client error logs

Contact your system administrator for deployment and configuration issues.
