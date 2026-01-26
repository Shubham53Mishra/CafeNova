# Fix 404 Error on Render.com - Image Upload

## ❌ Problem:
```
POST https://cafenova.onrender.com/api/vendor/cafe/1/images/upload
Error: 404 Not Found
```

---

## ✅ Solution - 3 Steps:

### **Step 1: Run Migrations on Render**
1. Go to **Render.com Dashboard**
2. Select your service
3. Go to **Shell** tab
4. Run command:
```bash
php artisan migrate --force
```
✅ This creates `cafe_images` table

---

### **Step 2: Create Storage Symlink**
In **Shell** tab, run:
```bash
php artisan storage:link
```
✅ This allows access to uploaded images from public URL

---

### **Step 3: Clear Caches**
In **Shell** tab, run:
```bash
php artisan cache:clear
php artisan route:cache
php artisan config:cache
php artisan view:cache
```
✅ Refresh all caches

---

## Alternative: Use Render Build Command

Edit `render.yaml` and add build command:

```yaml
services:
  - type: web
    name: cafenova
    buildCommand: |
      composer install
      php artisan migrate --force
      php artisan storage:link
      php artisan cache:clear
    startCommand: "sh start.sh"
```

Then **redeploy** your service.

---

## Test After Fix:

### ✅ Get Token First:
```bash
curl -X POST https://cafenova.onrender.com/api/vendor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_or_mobile": "vendor@example.com",
    "password": "password123"
  }'
```

### ✅ Upload Images:
```bash
curl -X POST https://cafenova.onrender.com/api/vendor/cafe/1/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## In Postman:

1. **Login** to get token
2. **Set Environment Variables:**
   ```
   base_url = https://cafenova.onrender.com
   vendor_token = (from login response)
   cafe_id = 1
   ```
3. **Upload Images:**
   ```
   POST {{base_url}}/api/vendor/cafe/{{cafe_id}}/images/upload
   Headers: Authorization: Bearer {{vendor_token}}
   Body: form-data → images (select files)
   ```

---

## If Still Getting 404:

Check if:
1. ✅ Migration ran successfully: `cafe_images` table exists
2. ✅ Storage symlink created: `storage/app/public` linked
3. ✅ Controller exists: `CafeController@uploadCafeImages`
4. ✅ Route registered: Check API routes file
5. ✅ No route caching issues: Clear caches again

---

## View Logs on Render:

Click **Logs** tab to see errors:
```bash
tail -f storage/logs/laravel.log
```

---

## Common Issues:

### ❌ "Storage disk 'public' not found"
**Fix:** Run `php artisan storage:link`

### ❌ "No query results found" (404)
**Fix:** Cafe ID doesn't exist. Use valid cafe_id.

### ❌ "Unauthenticated"
**Fix:** Token is missing or expired. Login again.

### ❌ "File upload too large"
**Fix:** Image > 2MB. Reduce file size.

---

## Production Checklist:

- [ ] Migrations ran successfully
- [ ] Storage symlink created
- [ ] Caches cleared
- [ ] Token obtained from login
- [ ] Valid cafe_id used
- [ ] Images uploaded successfully
- [ ] Images accessible via public URL

