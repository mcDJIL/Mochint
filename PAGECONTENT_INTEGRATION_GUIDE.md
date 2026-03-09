# 📚 Panduan Integrasi Page Content dengan Home

## ✅ Perbaikan yang Telah Dilakukan

### 1. **Perbaikan Upload Gambar**
- ✨ **Interface yang lebih jelas** - Sekarang ada 2 metode upload yang terpisah dengan jelas:
  - Upload dari perangkat (max 2MB)
  - Input URL gambar
- 🔄 **Preview yang lebih baik** - Gambar preview ditampilkan dengan lebih jelas
- ⚠️ **Error handling** - Jika gambar gagal dimuat, akan ada notifikasi error
- 🗑️ **Tombol hapus gambar** - Dapat menghapus gambar dan upload ulang

### 2. **Panduan Section Key untuk Home**
- 📌 Banner info ditampilkan saat memilih Page Type: **Home**
- 🎯 Menunjukkan section_key yang tersedia untuk halaman Home
- 💡 Tips khusus untuk mengubah section About di Home

### 3. **Validasi dan Feedback**
- ✅ Field section_key sekarang required untuk page_type=home
- 📝 Placeholder yang lebih deskriptif
- 🎨 Visual styling yang lebih menarik dan mudah dipahami

---

## 🏠 Struktur Konten Halaman Home

Halaman Home mengambil konten dari database dengan **page_type='home'** dan menggunakan **section_key** untuk membedakan setiap bagian.

### Section Key yang Tersedia

| Section Key | Deskripsi | Field yang Digunakan |
|------------|-----------|---------------------|
| `hero` | Banner utama halaman | title, subtitle, image_url |
| `about` | Section About di Home | title, subtitle, content, image_url |
| `services` | Layanan yang ditawarkan | title, subtitle, content |
| `promo_banner` | Banner promosi | title, subtitle, content, image_url, additional_data |
| `footer_contact` | Kontak di footer | title, subtitle, content, additional_data (whatsapp_url, phone_display, map_embed_url) |

---

## 🎨 Cara Mengubah Gambar Section About di Home

### Langkah-langkah:

1. **Login sebagai Admin**
2. **Buka menu "Kelola Konten"**
3. **Pilih tab "Home"** di filter
4. **Cari card dengan Section Key: `about`**
   - Jika belum ada, klik "Tambah Konten"
5. **Klik tombol "Edit"** pada card tersebut
6. **Pilih salah satu metode upload:**

#### Metode 1: Upload dari Perangkat
```
1. Klik tombol "Choose File" atau "Browse"
2. Pilih gambar dari komputer (max 2MB)
3. Gambar akan otomatis di-preview
4. Klik "Perbarui" untuk menyimpan
```

#### Metode 2: Menggunakan URL
```
1. Copy URL gambar dari internet atau server lain
2. Paste URL di field "Masukkan URL Gambar"
3. Gambar akan otomatis di-preview
4. Klik "Perbarui" untuk menyimpan
```

### 💡 Tips Penting:
- ✅ Pastikan **Page Type = Home**
- ✅ Pastikan **Section Key = about**
- ✅ Gunakan gambar dengan rasio 4:3 atau 16:9 untuk hasil terbaik
- ✅ Ukuran file maksimal 2MB untuk upload langsung
- ✅ Untuk URL, pastikan URL gambar dapat diakses public

---

## 🔧 Troubleshooting

### Problem 1: Gambar Tidak Muncul di Home
**Solusi:**
- Periksa bahwa `page_type = 'home'` dan `section_key = 'about'`
- Pastikan konten dalam status **Aktif** (is_active = true)
- Cek URL gambar valid dan dapat diakses
- Clear cache browser (Ctrl + F5)

### Problem 2: Gambar Tidak Bisa Diganti
**Solusi:**
- Hapus gambar lama dulu dengan tombol X merah
- Upload gambar baru atau masukkan URL baru
- Pastikan file tidak lebih dari 2MB
- Jika menggunakan URL, cek URL valid dengan buka di tab baru

### Problem 3: Preview Tidak Muncul
**Solusi:**
- Jika upload file, tunggu sampai proses selesai
- Jika pakai URL, pastikan URL lengkap dengan https://
- Cek format gambar (harus jpg, png, atau webp)
- Coba refresh halaman

### Problem 4: Data Tidak Muncul di Home
**Solusi:**
1. Cek di admin apakah data sudah tersimpan
2. Pastikan status konten **Aktif** (toggle hijau)
3. Periksa database: 
   ```sql
   SELECT * FROM page_information 
   WHERE page_type = 'home' 
   AND section_key = 'about' 
   AND is_active = 1;
   ```
4. Refresh halaman Home (Ctrl + F5)

---

## 📊 Contoh Data untuk Section About

### Minimal Setup:
```json
{
  "page_type": "home",
  "section_key": "about",
  "title": "Rumah Cantik Mochint Beauty Care",
  "subtitle": "Kenali Mochint Lebih Dekat",
  "content": "Selamat datang di Mochint Beauty Care, salon kecantikan yang berlokasi di Pandaan Pasuruan Jawa Timur. Kami hadir sebagai solusi bagi Anda yang ingin merawat kulit dengan teknologi terkini dan bahan premium.",
  "image_url": "https://example.com/clinic-image.jpg",
  "is_active": true,
  "display_order": 1
}
```

### Dengan URL Gambar External:
```json
{
  "page_type": "home",
  "section_key": "about",
  "title": "Kenali Mochint Lebih Dekat Mochint",
  "subtitle": "RUMAH CANTIK",
  "content": "Selamat datang di Mochint Beauty Care, salon kecantikan yang berlokasi di Pandaan Pasuruan Jawa Timur. Kami hadir sebagai solusi bagi Anda yang ingin merawat kulit dengan teknologi terkini dan bahan premium.",
  "image_url": "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
  "is_active": true,
  "display_order": 1
}
```

### Dengan Upload Base64:
```json
{
  "page_type": "home",
  "section_key": "about",
  "title": "Kenali Mochint Lebih Dekat Mochint",
  "subtitle": "RUMAH CANTIK",
  "content": "Selamat datang di Mochint Beauty Care...",
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "is_active": true,
  "display_order": 1
}
```

---

## 🎯 Best Practices

### 1. Penamaan Section Key
- Gunakan lowercase dan underscore
- Descriptive dan spesifik
- Konsisten dengan struktur halaman

### 2. Manajemen Gambar
- Untuk performa lebih baik, gunakan URL dari CDN atau image hosting
- Compress gambar sebelum upload (tools: TinyPNG, Squoosh)
- Gunakan format WebP jika browser support
- Ukuran optimal: 1200px - 1920px width

### 3. Konten Text
- Title: Maksimal 60 karakter
- Subtitle: Maksimal 100 karakter
- Content: Maksimal 500 karakter untuk preview yang baik

### 4. Display Order
- Gunakan kelipatan 10 (10, 20, 30) untuk fleksibilitas insert di tengah
- Smaller number = appears first

---

## 📱 Responsive Design

Gambar yang diupload akan otomatis responsive di Home page:
- **Desktop (lg)**: 50% width
- **Tablet (md)**: 50% width
- **Mobile**: 100% width

Border dan shadow akan otomatis menyesuaikan.

---

## 🔐 Keamanan

- Upload gambar hanya bisa dilakukan oleh **Admin** (middleware auth)
- File size dibatasi max 2MB
- File type validation (hanya image/*)
- XSS protection dengan proper escaping

---

## 🚀 Performance Tips

1. **Gunakan URL external** untuk gambar besar
2. **Lazy loading** sudah diimplementasi di Home.jsx
3. **Cache gambar** di browser untuk loading lebih cepat
4. **Optimize image** sebelum upload

---

## 📞 Support

Jika masih ada masalah, hubungi developer atau cek:
1. Browser Console (F12) untuk error JavaScript
2. Network tab untuk error loading gambar
3. Server logs untuk error backend

---

*Last Updated: March 9, 2026*
*Version: 2.0*
