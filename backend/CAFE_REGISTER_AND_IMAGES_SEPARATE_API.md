# Cafe Registration & Images - Separate APIs Guide

## 📋 Overview

Two separate APIs for better workflow:
1. **API 1:** Register Cafe (without images)
2. **API 2:** Upload Images to Cafe (separate endpoint)

---

## Workflow

```
Step 1: Vendor Signup
   ↓
Step 2: Vendor Login (get token)
   ↓
Step 3: Register Cafe (get cafe_id)
   ↓
Step 4: Upload Images to Cafe (using cafe_id)
```

---

## API 1: Register Cafe (No Images)

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/cafe/register`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: application/json
  ```

### Request Body (JSON - NO files):
```json
{
  "cafe_name": "Coffee Paradise",
  "cafe_description": "Best coffee shop with cozy ambiance",
  "address": "123 MG Road",
  "city": "Bangalore",
  "state": "KA",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### In Postman:
1. Method: **POST**
2. URL: `{{base_url}}/api/vendor/cafe/register`
3. Headers: Add `Authorization: Bearer {{vendor_token}}`
4. Body: Select **raw** → **JSON**
5. Paste the JSON payload

### Success Response (201):
```json
{
  "success": true,
  "message": "Cafe registered successfully",
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
    "updated_at": "2026-01-26T10:30:00.000000Z"
  }
}
```

**👉 Save `cafe.id` to environment variable `{{cafe_id}}`**

---

## API 2: Upload Images to Cafe

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}/images/upload`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: multipart/form-data
  ```

### Request Body (Form Data - Multiple Files):
```
images : [select image files]
images : [add more images]
images : [add more images]
```

### In Postman:
1. Method: **POST**
2. URL: `{{base_url}}/api/vendor/cafe/{{cafe_id}}/images/upload`
3. Headers: Add `Authorization: Bearer {{vendor_token}}`
4. Body: Select **form-data**
5. Add multiple entries with key **`images`** (type: **File**)
6. Select image files for each row

### Success Response (200):
```json
{
  "success": true,
  "message": "Images uploaded successfully",
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
    "images": [
      {
        "id": 1,
        "cafe_id": 1,
        "image_path": "cafe_images/abc123def456.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/abc123def456.jpg",
        "is_primary": true,
        "created_at": "2026-01-26T10:30:05.000000Z",
        "updated_at": "2026-01-26T10:30:05.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/ghi789jkl012.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/ghi789jkl012.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:06.000000Z",
        "updated_at": "2026-01-26T10:30:06.000000Z"
      }
    ]
  }
}
```

---

## Get Cafe with All Images

### Request Details:
- **Method:** `GET`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  ```

### In Postman:
1. Method: **GET**
2. URL: `{{base_url}}/api/vendor/cafe/{{cafe_id}}`
3. Headers: Add `Authorization: Bearer {{vendor_token}}`

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
    "images": [
      {
        "id": 1,
        "cafe_id": 1,
        "image_path": "cafe_images/abc123def456.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/abc123def456.jpg",
        "is_primary": true,
        "created_at": "2026-01-26T10:30:05.000000Z",
        "updated_at": "2026-01-26T10:30:05.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/ghi789jkl012.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/ghi789jkl012.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:06.000000Z",
        "updated_at": "2026-01-26T10:30:06.000000Z"
      }
    ]
  }
}
```

---

## Delete Cafe Image

### Request Details:
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}/image/{{image_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  ```

### In Postman:
1. Method: **DELETE**
2. URL: `{{base_url}}/api/vendor/cafe/{{cafe_id}}/image/{{image_id}}`
3. Headers: Add `Authorization: Bearer {{vendor_token}}`

### Success Response (200):
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Test Error Cases

### ❌ Register Cafe - Missing Required Field
```json
{
  "cafe_name": "Coffee Paradise",
  "address": "123 MG Road"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "cafe_description": ["The cafe description field is required."],
    "city": ["The city field is required."],
    "state": ["The state field is required."],
    "pincode": ["The pincode field is required."],
    "latitude": ["The latitude field is required."],
    "longitude": ["The longitude field is required."]
  }
}
```

---

### ❌ Upload Images - No Images Provided
```
(No images selected in form-data)
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "images": ["The images field is required."]
  }
}
```

---

### ❌ Upload Images - Invalid File Format
```
images: [select a .pdf file]
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "images.0": [
      "The images.0 must be an image.",
      "The images.0 must be a file of type: jpeg, png, jpg, gif."
    ]
  }
}
```

---

### ❌ Upload Images - File Too Large (> 2MB)
```
images: [select file > 2MB]
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "images.0": ["The images.0 must not be greater than 2048 kilobytes."]
  }
}
```

---

## cURL Commands

### 1. Register Cafe:
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

### 2. Upload Images:
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/1/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

### 3. Get Cafe with Images:
```bash
curl -X GET http://localhost:8000/api/vendor/cafe/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Delete Image:
```bash
curl -X DELETE http://localhost:8000/api/vendor/cafe/1/image/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Complete Workflow in Postman

### Step 1: Create Environment Variables
```
base_url = http://localhost:8000
vendor_token = (empty - will be filled after login)
cafe_id = (empty - will be filled after cafe registration)
```

### Step 2: Vendor Signup
```
POST /api/vendor/signup
Body (JSON):
{
  "name": "Coffee Master",
  "email": "coffeemaster@cafe.com",
  "phone": "9876543210",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Step 3: Vendor Login
```
POST /api/vendor/login
Body (JSON):
{
  "email_or_mobile": "coffeemaster@cafe.com",
  "password": "password123"
}

Tests (save token):
pm.environment.set("vendor_token", pm.response.json().token);
```

### Step 4: Register Cafe ⭐
```
POST /api/vendor/cafe/register
Headers: Authorization: Bearer {{vendor_token}}
Body (JSON):
{
  "cafe_name": "Coffee Paradise",
  "cafe_description": "Best coffee shop",
  "address": "123 MG Road",
  "city": "Bangalore",
  "state": "KA",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946
}

Tests (save cafe_id):
pm.environment.set("cafe_id", pm.response.json().cafe.id);
```

### Step 5: Upload Images ⭐
```
POST /api/vendor/cafe/{{cafe_id}}/images/upload
Headers: Authorization: Bearer {{vendor_token}}
Body (form-data):
  images: [select image1.jpg]
  images: [select image2.jpg]
  images: [select image3.jpg]
```

### Step 6: Get Cafe with Images
```
GET /api/vendor/cafe/{{cafe_id}}
Headers: Authorization: Bearer {{vendor_token}}
```

### Step 7: Delete Specific Image
```
DELETE /api/vendor/cafe/{{cafe_id}}/image/1
Headers: Authorization: Bearer {{vendor_token}}
```

---

## API Summary

| API | Method | URL | Purpose |
|-----|--------|-----|---------|
| Register Cafe | POST | `/api/vendor/cafe/register` | Create cafe (JSON) |
| Upload Images | POST | `/api/vendor/cafe/{id}/images/upload` | Add images (multipart) |
| Get Cafe | GET | `/api/vendor/cafe/{id}` | View cafe + images |
| Delete Image | DELETE | `/api/vendor/cafe/{id}/image/{imageId}` | Delete image |
| Get All Cafes | GET | `/api/vendor/cafes` | List all vendor cafes |

---

## Validation Rules

### Cafe Registration:
- `cafe_name` - Required, String, Max 255
- `cafe_description` - Required, String
- `address` - Required, String
- `city` - Required, String
- `state` - Required, String
- `pincode` - Required, 6 digits exactly
- `latitude` - Required, -90 to 90
- `longitude` - Required, -180 to 180

### Image Upload:
- `images` - Required, Array, Min 1
- `images.*` - Required, Image, JPEG/PNG/JPG/GIF, Max 2MB

---

## Key Points

✅ **Separate APIs** for cafe and images  
✅ **Cafe registration** uses JSON (no files)  
✅ **Image upload** uses multipart form-data  
✅ **Multiple images** supported in single request  
✅ **First image** marked as primary  
✅ **Direct image URLs** provided in response  
✅ **Cascade delete** - images deleted when cafe deleted  
✅ **Vendor isolation** - vendors can only manage their own cafes  

