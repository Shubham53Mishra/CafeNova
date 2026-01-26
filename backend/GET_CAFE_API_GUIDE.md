# GET Cafe API - Testing Guide

## Overview
Get cafe details with all uploaded images using the GET endpoints.

---

## 1. GET Single Cafe with Images

### Endpoint
```
GET /api/vendor/cafe/{cafeId}
```

### URL (Localhost)
```
http://localhost:8000/api/vendor/cafe/1
```

### URL (Production)
```
https://cafenova.onrender.com/api/vendor/cafe/1
```

### Headers Required
```
Authorization: Bearer YOUR_TOKEN
```

### Postman Steps
1. Method: **GET**
2. URL: `http://localhost:8000/api/vendor/cafe/1`
3. Authorization tab:
   - Type: **Bearer Token**
   - Token: (paste your vendor token)
4. Click **Send**

### cURL Command
```bash
curl -X GET http://localhost:8000/api/vendor/cafe/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response (Success)
```json
{
  "success": true,
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "My Cafe",
    "cafe_description": "Best cafe in town",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "created_at": "2026-01-27T10:00:00.000000Z",
    "updated_at": "2026-01-27T10:00:00.000000Z",
    "images": [
      {
        "id": 1,
        "cafe_id": 1,
        "image_path": "cafe_images/12th_result.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/12th_result.jpg",
        "is_primary": false,
        "created_at": "2026-01-27T10:05:00.000000Z",
        "updated_at": "2026-01-27T10:05:00.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/photo2.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/photo2.jpg",
        "is_primary": false,
        "created_at": "2026-01-27T10:06:00.000000Z",
        "updated_at": "2026-01-27T10:06:00.000000Z"
      }
    ],
    "items": []
  }
}
```

---

## 2. GET All Cafes for Vendor

### Endpoint
```
GET /api/vendor/cafes
```

### URL (Localhost)
```
http://localhost:8000/api/vendor/cafes
```

### URL (Production)
```
https://cafenova.onrender.com/api/vendor/cafes
```

### Headers Required
```
Authorization: Bearer YOUR_TOKEN
```

### Postman Steps
1. Method: **GET**
2. URL: `http://localhost:8000/api/vendor/cafes`
3. Authorization tab:
   - Type: **Bearer Token**
   - Token: (paste your vendor token)
4. Click **Send**

### cURL Command
```bash
curl -X GET http://localhost:8000/api/vendor/cafes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response (Success)
```json
{
  "success": true,
  "cafes": [
    {
      "id": 1,
      "vendor_id": 1,
      "cafe_name": "My Cafe",
      "cafe_description": "Best cafe in town",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pincode": "100001",
      "latitude": "40.7128",
      "longitude": "-74.0060",
      "created_at": "2026-01-27T10:00:00.000000Z",
      "updated_at": "2026-01-27T10:00:00.000000Z",
      "images": [
        {
          "id": 1,
          "cafe_id": 1,
          "image_path": "cafe_images/12th_result.jpg",
          "image_url": "http://localhost:8000/storage/cafe_images/12th_result.jpg",
          "is_primary": false,
          "created_at": "2026-01-27T10:05:00.000000Z",
          "updated_at": "2026-01-27T10:05:00.000000Z"
        }
      ],
      "items": []
    },
    {
      "id": 2,
      "vendor_id": 1,
      "cafe_name": "Another Cafe",
      "cafe_description": "Another great cafe",
      "address": "456 Oak Ave",
      "city": "Boston",
      "state": "MA",
      "pincode": "100002",
      "latitude": "42.3601",
      "longitude": "-71.0589",
      "created_at": "2026-01-27T11:00:00.000000Z",
      "updated_at": "2026-01-27T11:00:00.000000Z",
      "images": [],
      "items": []
    }
  ]
}
```

---

## 3. Accessing Image URLs

All images uploaded via the API will have a full URL like:
```
http://localhost:8000/storage/cafe_images/YOUR_IMAGE_NAME.jpg
```

Or on production:
```
https://cafenova.onrender.com/storage/cafe_images/YOUR_IMAGE_NAME.jpg
```

### To View Image
- Paste the `image_url` from the response directly in browser
- Or use in an `<img>` tag:
```html
<img src="http://localhost:8000/storage/cafe_images/12th_result.jpg" />
```

---

## 4. Response Fields Explained

### Cafe Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique cafe ID |
| `vendor_id` | integer | ID of vendor who owns this cafe |
| `cafe_name` | string | Name of the cafe |
| `cafe_description` | string | Description of cafe |
| `address` | string | Street address |
| `city` | string | City name |
| `state` | string | State code |
| `pincode` | string | Postal code |
| `latitude` | string | Latitude coordinate |
| `longitude` | string | Longitude coordinate |
| `images` | array | Array of CafeImage objects |
| `items` | array | Array of Item objects |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### CafeImage Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique image ID |
| `cafe_id` | integer | ID of cafe this image belongs to |
| `image_path` | string | Path in storage |
| `image_url` | string | Full URL to access image |
| `is_primary` | boolean | Whether this is primary image |
| `created_at` | string | Upload timestamp |
| `updated_at` | string | Last update timestamp |

---

## 5. Error Responses

### Cafe Not Found (404)
```json
{
  "success": false,
  "message": "Cafe not found"
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Cafe Doesn't Belong to Vendor
The API only returns cafes that belong to the authenticated vendor. Other vendors' cafes won't be visible.

---

## 6. Complete Workflow Example

### Step 1: Register a Cafe
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cafe_name": "My Cafe",
    "cafe_description": "Best cafe in town",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "100001",
    "latitude": "40.7128",
    "longitude": "-74.0060"
  }'
```

Response: `{ "success": true, "cafe": { "id": 1, ... } }`

### Step 2: Upload Images
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/1/images/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg"
```

Response: `{ "success": true, "uploaded_count": 2, ... }`

### Step 3: Get Cafe with Images
```bash
curl -X GET http://localhost:8000/api/vendor/cafe/1 \
  -H "Authorization: Bearer TOKEN"
```

Response: Cafe object with all uploaded images!

---

## 7. Testing Complete Cycle in Postman

### Request 1: Get All Cafes
- **GET** `http://localhost:8000/api/vendor/cafes`
- See all your cafes and their images

### Request 2: Get Single Cafe
- **GET** `http://localhost:8000/api/vendor/cafe/1`
- See detailed cafe info with all images

### Request 3: View Image
- Copy `image_url` from response
- Open in browser to view the uploaded image

---

## 8. Production Testing

Replace `localhost:8000` with `cafenova.onrender.com`:

```bash
# Get all cafes
curl -X GET https://cafenova.onrender.com/api/vendor/cafes \
  -H "Authorization: Bearer TOKEN"

# Get single cafe
curl -X GET https://cafenova.onrender.com/api/vendor/cafe/1 \
  -H "Authorization: Bearer TOKEN"

# View image (copy image_url from response)
# https://cafenova.onrender.com/storage/cafe_images/YOUR_IMAGE.jpg
```

---

## ✅ Summary

| Action | Method | Endpoint | Returns |
|--------|--------|----------|---------|
| Get all cafes | GET | `/api/vendor/cafes` | Array of cafe objects with images |
| Get single cafe | GET | `/api/vendor/cafe/{id}` | Single cafe object with images |
| Register cafe | POST | `/api/vendor/cafe/register` | Cafe object with ID |
| Upload images | POST | `/api/vendor/cafe/{id}/images/upload` | Cafe object with images |
| Delete image | DELETE | `/api/vendor/cafe/{id}/image/{imageId}` | Success message |
| Update cafe | PUT | `/api/vendor/cafe/{id}` | Updated cafe object |
| Delete cafe | DELETE | `/api/vendor/cafe/{id}` | Success message |

All authenticated endpoints require `Authorization: Bearer TOKEN` header!
