# Instruksi Setup Fitur Disable Timeslots

## 1. Jalankan Migration Database

Buka terminal dan jalankan query SQL berikut untuk membuat tabel `disabled_timeslots`:

```bash
cd server
mysql -u root -p klinik_kecantikan < create_timeslots_table.sql
```

Atau jalankan langsung di MySQL:

```sql
CREATE TABLE IF NOT EXISTS disabled_timeslots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time_slot VARCHAR(5) NOT NULL COMMENT 'Format: HH:MM',
  reason VARCHAR(255) DEFAULT NULL,
  disabled_by VARCHAR(100) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date_time (date, time_slot),
  INDEX idx_date (date),
  INDEX idx_time_slot (time_slot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Restart Server

```bash
cd server
npm start
```

## 3. Cara Menggunakan Fitur

### Untuk Admin (BedManagement.jsx):
1. Buka halaman **Bed Management** di admin panel
2. Pilih tanggal yang ingin diatur
3. Pada setiap time slot, ada tombol **X (merah)** atau **✓ (hijau)**:
   - **Tombol X merah**: Klik untuk menonaktifkan slot (user tidak bisa pilih)
   - **Tombol ✓ hijau**: Klik untuk mengaktifkan kembali slot
4. Slot yang dinonaktifkan akan muncul dengan:
   - Background abu-abu
   - Teks "DISABLED"
   - Opacity 60%

### Untuk Member (BookingStep3.jsx):
1. Ketika user membuka halaman booking Step 3
2. Slot yang sudah dinonaktifkan admin akan muncul dengan:
   - Background abu-abu
   - Teks "DITUTUP"
   - Tidak bisa diklik (disabled)
3. Di legend, ada indikator baru: **Abu-abu = Ditutup**

## 4. API Endpoints

### Get Disabled Timeslots
```
GET /api/timeslots?date=2024-01-15
Authorization: Bearer {token}
```

### Toggle Timeslot (Enable/Disable)
```
POST /api/timeslots/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2024-01-15",
  "time_slot": "10:00",
  "reason": "Maintenance" (optional)
}
```

### Get All Disabled Timeslots
```
GET /api/timeslots/all
Authorization: Bearer {token}
```

### Delete Specific Disabled Timeslot
```
DELETE /api/timeslots/{id}
Authorization: Bearer {token}
```

### Clear Old Disabled Timeslots
```
DELETE /api/timeslots/clear/old
Authorization: Bearer {token}
```

## 5. Fitur-Fitur:
- ✅ Admin dapat disable/enable time slot kapan saja
- ✅ User tidak dapat memilih slot yang sudah disabled
- ✅ Visual indicator yang jelas (warna abu-abu, teks DITUTUP/DISABLED)
- ✅ Tooltip untuk menjelaskan status slot
- ✅ Database menyimpan riwayat disabled timeslots
- ✅ Automatic cleanup untuk data lama (optional dengan endpoint clear/old)
- ✅ Real-time update setelah toggle (refresh otomatis)

## 6. Database Schema

Table: `disabled_timeslots`
- `id`: INT (Primary Key, Auto Increment)
- `date`: DATE (Tanggal slot)
- `time_slot`: VARCHAR(5) (Jam slot, format HH:MM)
- `reason`: VARCHAR(255) (Alasan disable, optional)
- `disabled_by`: VARCHAR(100) (Siapa yang disable, default 'admin')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

Unique constraint: (`date`, `time_slot`) - Tidak bisa ada duplikat untuk tanggal dan jam yang sama.
