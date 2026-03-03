# Fitur Promo untuk Treatment

Fitur promo telah berhasil ditambahkan ke halaman Treatment, mirip dengan fitur promo di Product page.

## Perubahan yang Dilakukan

### 1. Database Migration
File: `server/add_treatment_promo_fields.sql`

Menambahkan 3 kolom baru ke tabel `treatments`:
- `discount_percentage` (INT) - Persentase diskon (0-100)
- `promo_start_date` (DATE) - Tanggal mulai promo
- `promo_end_date` (DATE) - Tanggal berakhir promo

**Cara menjalankan migration:**
```sql
-- Jalankan query SQL berikut di database Anda
source server/add_treatment_promo_fields.sql
```

Atau via phpMyAdmin atau MySQL client:
```bash
mysql -u root -p beauty_clinic < server/add_treatment_promo_fields.sql
```

### 2. Backend - Treatment Model
File: `server/models/Treatment.js`

**Perubahan:**
- Method `create()` - Menambahkan parameter `discountPercentage`, `promoStartDate`, `promoEndDate`
- Method `update()` - Menambahkan parameter promo untuk update data

### 3. Frontend - Treatment Page
File: `src/pages/admin/Treatment.jsx`

**Fitur yang ditambahkan:**

#### a. State Management
- Menambahkan field promo ke `formData`:
  - `discountPercentage`
  - `promoStartDate` 
  - `promoEndDate`

#### b. Helper Functions
- `isPromoActive(treatment)` - Mengecek apakah promo sedang aktif
- `calculateDiscountedPrice(price, discountPercentage)` - Menghitung harga setelah diskon

#### c. UI Promo di Treatment Card
- Badge "PROMO X%" di pojok kiri atas gambar (hanya tampil jika promo aktif)
- Harga coret (harga asli) dan harga diskon berwarna merah
- Otomatis menghitung harga setelah diskon

#### d. Form Promo di Modal Edit/Add
Bagian "Pengaturan Promo" dengan field:
- **Diskon (%)** - Input number 0-100
- **Tanggal Mulai Promo** - Date picker
- **Tanggal Berakhir Promo** - Date picker
- **Preview Harga Promo** - Menampilkan preview harga setelah diskon

## Cara Menggunakan

### 1. Menjalankan Migration
Pertama, jalankan file SQL migration untuk menambahkan kolom promo:

```bash
cd server
mysql -u root -p beauty_clinic < add_treatment_promo_fields.sql
```

### 2. Restart Server (Jika Perlu)
Jika server sedang berjalan, restart untuk memastikan perubahan model diterapkan:

```bash
cd server
npm start
```

### 3. Mengatur Promo di Admin Panel

#### Tambah Treatment Baru dengan Promo:
1. Klik tombol "Tambah Perawatan"
2. Isi detail perawatan (nama, kategori, durasi, harga, dll)
3. Scroll ke bawah ke bagian "Pengaturan Promo"
4. Masukkan:
   - Persentase diskon (misalnya: 20 untuk diskon 20%)
   - Tanggal mulai promo
   - Tanggal berakhir promo
5. Lihat preview harga promo di bawah form
6. Klik "Tambah Perawatan"

#### Edit Treatment Existing untuk Menambah Promo:
1. Klik tombol "Edit" pada treatment card
2. Scroll ke bagian "Pengaturan Promo"
3. Atur diskon dan periode promo
4. Klik "Simpan Perubahan"

### 4. Melihat Treatment dengan Promo
Di halaman admin Treatment, treatment yang sedang promo akan menampilkan:
- Badge merah "PROMO X%" di pojok kiri atas gambar
- Harga asli dicoret
- Harga setelah diskon dalam warna merah

## Validasi Promo Aktif

Promo akan dianggap aktif jika memenuhi semua kondisi berikut:
1. `discount_percentage` > 0
2. `promo_start_date` sudah diisi
3. `promo_end_date` sudah diisi  
4. Tanggal sekarang >= `promo_start_date`
5. Tanggal sekarang <= `promo_end_date`

Jika salah satu kondisi tidak terpenuhi, badge promo dan harga diskon tidak akan ditampilkan.

## Contoh Penggunaan

### Contoh 1: Promo Lebaran 25%
- Treatment: Hydrating Facial
- Harga Normal: Rp 120.000
- Diskon: 25%
- Tanggal Mulai: 2026-03-15
- Tanggal Berakhir: 2026-03-31
- **Harga Promo: Rp 90.000**

### Contoh 2: Promo Akhir Tahun 30%
- Treatment: Acne Clear Treatment
- Harga Normal: Rp 150.000
- Diskon: 30%
- Tanggal Mulai: 2026-12-15
- Tanggal Berakhir: 2026-12-31
- **Harga Promo: Rp 105.000**

## Notes

- Promo dapat diubah atau dihapus kapan saja dengan mengedit treatment
- Untuk menghapus promo, set `discount_percentage` ke 0 atau kosongkan tanggal promo
- Harga asli treatment tidak berubah, hanya perhitungan diskon yang ditampilkan
- Preview harga promo di form akan otomatis update saat Anda mengubah diskon atau harga

## Troubleshooting

### Promo tidak muncul di card:
- Pastikan migration sudah dijalankan
- Cek apakah tanggal promo valid (promo_start_date <= hari ini <= promo_end_date)
- Pastikan discount_percentage > 0

### Error saat save:
- Pastikan backend model sudah diupdate
- Cek console browser untuk error detail
- Verifikasi database sudah memiliki kolom promo

### Preview harga tidak muncul:
- Pastikan field Harga sudah diisi
- Pastikan Diskon (%) > 0
- Refresh halaman jika perlu
