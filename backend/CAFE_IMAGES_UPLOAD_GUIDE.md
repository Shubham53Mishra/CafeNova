# Cafe Images Upload - Postman Testing Guide

## 📋 Overview

Vendors can now upload multiple images when registering a cafe and add more images later.

---

## Step 1: Register Cafe with Images

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/cafe/register`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: multipart/form-data
  ```

### Request Body (Form Data):
```
cafe_name          : Coffee Paradise
cafe_description   : Best coffee shop
address            : 123 MG Road
city               : Bangalore
state              : KA
pincode            : 560001
latitude           : 12.9716
longitude          : 77.5946
images             : [select 1 or more image files]
```

### In Postman:
1. Set method to **POST**
2. URL: `{{base_url}}/api/vendor/cafe/register`
3. Go to **Headers** tab - Content-Type will be auto-set when you use form-data
4. Go to **Body** tab → Select **form-data**
5. Add fields:
   - cafe_name (text)
   - cafe_description (text)
   - address (text)
   - city (text)
   - state (text)
   - pincode (text)
   - latitude (text)
   - longitude (text)
   - images (file) - add first file
   - Click **+ Add** and add more images with key **images**

### Success Response (201):
```json
{
  "success": true,
  "message": "Cafe registered successfully with images",
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop",
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
        "image_path": "cafe_images/abc123.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/abc123.jpg",
        "is_primary": true,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/def456.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/def456.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      }
    ]
  }
}
```

---

## Step 2: Upload More Images to Existing Cafe

### Request Details:
- **Method:** `POST`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}/images/upload`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  Content-Type: multipart/form-data
  ```

### Request Body (Form Data):
```
images : [select 1 or more image files]
```

### In Postman:
1. Set method to **POST**
2. URL: `{{base_url}}/api/vendor/cafe/{{cafe_id}}/images/upload`
3. Body → **form-data**
4. Add multiple images with key **images**

### Success Response (200):
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "cafe": {
    "id": 1,
    "vendor_id": 1,
    "cafe_name": "Coffee Paradise",
    "cafe_description": "Best coffee shop",
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
        "image_path": "cafe_images/abc123.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/abc123.jpg",
        "is_primary": true,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/def456.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/def456.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      },
      {
        "id": 3,
        "cafe_id": 1,
        "image_path": "cafe_images/ghi789.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/ghi789.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      }
    ]
  }
}
```

---

## Step 3: Get Cafe with All Images

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
    "cafe_description": "Best coffee shop",
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
        "image_path": "cafe_images/abc123.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/abc123.jpg",
        "is_primary": true,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      },
      {
        "id": 2,
        "cafe_id": 1,
        "image_path": "cafe_images/def456.jpg",
        "image_url": "http://localhost:8000/storage/cafe_images/def456.jpg",
        "is_primary": false,
        "created_at": "2026-01-26T10:30:00.000000Z",
        "updated_at": "2026-01-26T10:30:00.000000Z"
      }
    ]
  }
}
```

---

## Step 4: Delete Cafe Image

### Request Details:
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/vendor/cafe/{{cafe_id}}/image/{{image_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{vendor_token}}
  ```

### Success Response (200):
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### ❌ Image Not Found (404):
```json
{
  "success": false,
  "message": "Error: No query results found..."
}
```

---

## Step 5: Test Error Cases

### ❌ No Images Provided (During Registration)
```
cafe_name: Coffee Paradise
cafe_description: Best coffee shop
address: 123 MG Road
city: Bangalore
state: KA
pincode: 560001
latitude: 12.9716
longitude: 77.5946
(NO images field)
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "images": [
      "The images field is required."
    ]
  }
}
```

---

### ❌ Invalid Image Format
```
images: [select a .txt or .pdf file]
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

### ❌ Image Too Large (> 2MB)
```
images: [select a file larger than 2MB]
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "images.0": [
      "The images.0 must not be greater than 2048 kilobytes."
    ]
  }
}
```

---

### ❌ Missing Authorization Token
Remove Authorization header when uploading

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Image Specifications

| Property | Details |
|----------|---------|
| **Format** | JPEG, PNG, JPG, GIF |
| **Max Size** | 2 MB |
| **Min Images** | 1 (during registration) |
| **Max Images** | Unlimited |
| **Storage Path** | `/storage/cafe_images/` |
| **Access URL** | `http://localhost:8000/storage/cafe_images/{filename}` |
| **Primary Image** | First uploaded image marked as primary |

---

## Complete Testing Workflow

### 1️⃣ Vendor Signup & Login
```
POST /api/vendor/signup
POST /api/vendor/login
→ Save {{vendor_token}}
```

### 2️⃣ Register Cafe with Images
```
POST /api/vendor/cafe/register
Form Data: cafe details + multiple images
→ Save {{cafe_id}}
```

### 3️⃣ Upload More Images
```
POST /api/vendor/cafe/{{cafe_id}}/images/upload
Form Data: multiple images
```

### 4️⃣ Get Cafe Details (Shows All Images)
```
GET /api/vendor/cafe/{{cafe_id}}
```

### 5️⃣ Delete Specific Image
```
DELETE /api/vendor/cafe/{{cafe_id}}/image/{{image_id}}
```

---

## cURL Commands

### Register Cafe with Images:
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/register \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "cafe_name=Coffee Paradise" \
  -F "cafe_description=Best coffee shop" \
  -F "address=123 MG Road" \
  -F "city=Bangalore" \
  -F "state=KA" \
  -F "pincode=560001" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

### Upload More Images:
```bash
curl -X POST http://localhost:8000/api/vendor/cafe/1/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/image4.jpg" \
  -F "images=@/path/to/image5.jpg"
```

### Delete Image:
```bash
curl -X DELETE http://localhost:8000/api/vendor/cafe/1/image/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Key Features

✅ Multiple image upload support  
✅ Automatic image storage in public folder  
✅ Image URL generation for direct access  
✅ Primary image marking (first image)  
✅ Individual image deletion  
✅ Image validation (format, size)  
✅ Cafe images linked to cafe_id (cascade delete)  

