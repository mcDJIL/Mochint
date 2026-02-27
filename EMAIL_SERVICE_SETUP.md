# 📧 Setup Email Service untuk OTP - Panduan Lengkap

Panduan ini akan membantu Anda mengaktifkan email service untuk mengirim OTP sungguhan ke email pengguna (bukan lagi mode testing/console).

## 🎯 Yang Sudah Disiapkan

✅ **Nodemailer** sudah terinstall  
✅ **Email Service Module** sudah dibuat (`server/services/emailService.js`)  
✅ **AuthController** sudah diupdate untuk menggunakan email service  
✅ **Server** sudah terintegrasi dengan email service  
✅ **Template Email** yang bagus sudah tersedia  

## 📋 Yang Perlu Anda Lakukan

### **Pilihan 1: Menggunakan Gmail (Paling Mudah)**

#### **Step 1: Siapkan Gmail Account**
- Gunakan Gmail pribadi Anda atau buat Gmail khusus untuk aplikasi
- Contoh: `mochintclinic@gmail.com`

#### **Step 2: Aktifkan 2-Step Verification**

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Scroll ke bagian **"2-Step Verification"**
3. Klik **"Get Started"** dan ikuti instruksinya
4. Pastikan 2-Step Verification sudah **ON** (ini wajib untuk App Password)

#### **Step 3: Generate App Password**

1. Setelah 2-Step Verification aktif, kembali ke [Security Settings](https://myaccount.google.com/security)
2. Cari **"App passwords"** atau **"App-specific passwords"**
3. Jika tidak muncul, coba buka langsung: https://myaccount.google.com/apppasswords
4. Pilih **"Mail"** sebagai app
5. Pilih **"Other (Custom name)"** sebagai device
6. Ketik nama: `Mochint Beauty Clinic`
7. Klik **"Generate"**
8. Google akan memberikan password 16 karakter seperti: `abcd efgh ijkl mnop`
9. **SIMPAN password ini!** (tidak bisa dilihat lagi setelah ditutup)

#### **Step 4: Update File .env**

Buka file `server/.env` dan update bagian email:

```env
# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=mochintclinic@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Catatan:**
- Ganti `mochintclinic@gmail.com` dengan email Gmail Anda
- Ganti `abcd efgh ijkl mnop` dengan App Password yang Anda dapat dari Google
- **Jangan** gunakan password login Gmail biasa!
- **Hapus spasi** di App Password atau biarkan (nodemailer otomatis handle)

#### **Step 5: Restart Server**

```bash
cd server
npm start
# atau
node server.js
```

Anda akan melihat pesan:
```
✅ Email service ready - OTP will be sent to actual emails
```

Jika gagal, akan muncul:
```
⚠️ Email service not configured - Using development mode (OTP in console)
```

---

### **Pilihan 2: Menggunakan SMTP Service Lain**

Jika tidak ingin pakai Gmail, bisa gunakan:

#### **A. Outlook/Hotmail**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

#### **B. SendGrid (Recommended untuk Production)**
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### **C. Custom SMTP**
Jika Anda punya SMTP server sendiri, edit `server/services/emailService.js`:

```javascript
const emailConfig = {
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false, // true untuk port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};
```

---

## 🧪 Testing Email Service

### **Test 1: Check Console Log Saat Server Start**

Saat server berjalan, perhatikan console:

**✅ Berhasil:**
```
✅ Email service initialized successfully
✅ Email service ready - OTP will be sent to actual emails
```

**⚠️ Belum Dikonfigurasi:**
```
⚠️ Email service not configured. Using development mode (OTP in console).
```

**❌ Error:**
```
❌ Email service initialization failed: Invalid login: 535-5.7.8 Username and Password not accepted
```

### **Test 2: Coba Fitur Forgot Password**

1. Buka aplikasi: `http://localhost:5173/auth/login`
2. Klik **"Lupa Password?"**
3. Masukkan email yang valid
4. Klik **"Kirim Kode Verifikasi"**
5. **Cek email Anda!** OTP akan dikirim ke email sungguhan

### **Test 3: Cek Console untuk Debug**

Console akan menampilkan:
```
📤 Sending OTP to: user@example.com
✅ OTP email sent successfully to: user@example.com
📧 Message ID: <some-message-id>
```

---

## 🔧 Troubleshooting

### ❌ **Error: "connect ENETUNREACH 2404:6800:... IPv6 address"**

**Penyebab:**
- Nodemailer mencoba koneksi IPv6 tapi jaringan Anda tidak support IPv6
- Firewall atau ISP memblokir koneksi IPv6

**Solusi:** (✅ Sudah diperbaiki secara otomatis)
- Email service sudah dikonfigurasi untuk force IPv4 (`family: 4`)
- Restart server untuk menerapkan perubahan
- Jika masih error, cek koneksi internet Anda

### ❌ **Error: "Invalid login: 535-5.7.8 Username and Password not accepted"**

**Solusi:**
- Pastikan Anda menggunakan **App Password**, bukan password login Gmail
- Pastikan **2-Step Verification** sudah aktif
- Coba generate App Password baru

### ❌ **Error: "self signed certificate in certificate chain"**

**Solusi:**
- Sudah di-handle di konfigurasi TLS
- Jika masih error, update Node.js ke versi terbaru
- Atau set `NODE_TLS_REJECT_UNAUTHORIZED=0` di .env (not recommended for production)

### ❌ **Error: "Connection timeout" atau "ETIMEDOUT"**

**Solusi:**
- Cek koneksi internet Anda
- Pastikan firewall tidak memblokir port 587
- Coba ganti port ke 465 (SSL) di `emailService.js`:
  ```javascript
  port: 465,
  secure: true,
  ```
- Atau coba gunakan proxy jika di belakang corporate firewall

### ❌ **Email tidak masuk ke inbox**

**Solusi:**
- Cek folder **Spam/Junk**
- Tunggu beberapa menit (kadang ada delay)
- Cek apakah email pengirim sudah benar di console log

### ⚠️ **Gmail: "Less secure app access has been turned off"**

**Solusi:**
- Gunakan **App Password** (bukan password biasa)
- App Password tidak memerlukan "Less secure app" access

### ⚠️ **Tidak bisa akses App Passwords**

**Solusi:**
- Pastikan **2-Step Verification** sudah aktif
- Tunggu beberapa menit setelah mengaktifkan 2FA
- Logout dan login ulang ke Google Account
- Coba akses langsung: https://myaccount.google.com/apppasswords

---

## 🔒 Keamanan

### **DO's ✅**
- ✅ Gunakan App Password, bukan password login
- ✅ Simpan credentials di `.env` file
- ✅ Tambahkan `.env` ke `.gitignore`
- ✅ Gunakan email khusus untuk aplikasi (bukan email pribadi)
- ✅ Revoke App Password jika tidak dipakai lagi

### **DON'Ts ❌**
- ❌ Jangan commit file `.env` ke Git
- ❌ Jangan share App Password ke orang lain
- ❌ Jangan hardcode credentials di code
- ❌ Jangan gunakan password login Gmail biasa

---

## 📱 Template Email yang Dikirim

Sistem akan mengirim email dengan tampilan profesional yang berisi:

- 🎨 Design branded dengan warna Mochint
- 🔢 Kode OTP 6 digit yang besar dan jelas
- ⏰ Info expiry time (5 menit)
- ⚠️ Peringatan keamanan
- 📧 Footer dengan info kontak

---

## 🚀 Development Mode vs Production Mode

### **Development Mode** (Email tidak dikonfigurasi)
- OTP ditampilkan di **console server**
- OTP juga di-return di **API response** untuk testing
- Warning di console: `⚠️ Email service not configured`

### **Production Mode** (Email sudah dikonfigurasi)
- OTP dikirim ke **email sungguhan**
- OTP **tidak** di-return di API response (keamanan)
- Console log: `✅ OTP email sent successfully`

---

## 📝 Checklist Setup

Gunakan checklist ini untuk memastikan semuanya sudah benar:

- [ ] Nodemailer sudah terinstall (`npm install nodemailer`)
- [ ] 2-Step Verification Gmail sudah aktif
- [ ] App Password sudah di-generate dari Google
- [ ] File `.env` sudah diupdate dengan `EMAIL_USER` dan `EMAIL_PASSWORD`
- [ ] Server sudah di-restart
- [ ] Console menampilkan: `✅ Email service ready`
- [ ] Test kirim OTP dan email berhasil diterima
- [ ] OTP email masuk ke inbox (bukan spam)

---

## 💡 Tips Production

1. **Gunakan Email Domain Sendiri**
   - Lebih profesional: `noreply@mochintclinic.com`
   - Setup DNS records (SPF, DKIM, DMARC)

2. **Gunakan Service Khusus Email**
   - SendGrid (12,000 email/bulan gratis)
   - Mailgun (5,000 email/bulan gratis)
   - AWS SES (murah dan reliable)

3. **Monitor Email Sending**
   - Log semua email yang dikirim
   - Track delivery rate
   - Setup alerts untuk failures

4. **Rate Limiting**
   - Batasi request OTP per email (misal 3x dalam 1 jam)
   - Prevent spam/abuse

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:

1. Cek console log server untuk error message
2. Pastikan semua step sudah diikuti dengan benar
3. Coba generate App Password baru dari Google
4. Test dengan email lain untuk memastikan bukan masalah email penerima

---

**Selamat! Email service Anda sudah siap! 🎉**

Sekarang OTP akan dikirim ke email sungguhan, bukan lagi ditampilkan di console.
