# 🔥 Solusi Connection Timeout - Email Service

**Error yang Anda alami:**
```
❌ Email service initialization failed: Connection timeout
```

## ⚡ Quick Fix - Gunakan Development Mode

Sistem sudah **otomatis fallback** ke development mode, jadi **fitur tetap berfungsi normal**:

✅ Lupa password berfungsi  
✅ Email verification berfungsi  
✅ OTP ditampilkan di **console server**  
✅ OTP juga di-return di **API response** untuk testing  

**Anda tidak perlu email service untuk development!** Cukup lihat OTP di console server.

---

## 🔍 Penyebab Connection Timeout

### **1. Firewall/Antivirus Memblokir SMTP Port (Paling Umum)**
Windows Defender, Kaspersky, Avast, dll sering memblokir port 465 dan 587.

**Solusi:**
- Disable antivirus sementara untuk testing
- Atau tambahkan exception untuk Node.js di antivirus
- Atau tambahkan rule di Windows Firewall:
  ```
  Control Panel → Windows Defender Firewall → Advanced Settings
  → Outbound Rules → New Rule → Port 465 & 587 → Allow
  ```

### **2. ISP Memblokir SMTP (Untuk Prevent Spam)**
Beberapa ISP (Indihome, Biznet, dll) memblokir port SMTP untuk prevent spam.

**Solusi:**
- Hubungi ISP untuk unblock port 465/587
- Atau gunakan VPN untuk testing
- Atau gunakan alternatif service (lihat di bawah)

### **3. Corporate/Campus Network**
Jika di jaringan kampus/kantor, biasanya SMTP diblokir.

**Solusi:**
- Gunakan hotspot HP pribadi
- Atau gunakan alternatif service (lihat di bawah)

---

## 🎯 Solusi yang Sudah Diterapkan

✅ Skip verification saat startup (tidak blocking)  
✅ Timeout diperpanjang ke 30 detik  
✅ Force IPv4 (hindari IPv6 issues)  
✅ Auto fallback ke development mode  
✅ Better error logging  

---

## 🚀 Alternatif Solusi

### **Opsi 1: Tetap Pakai Development Mode (RECOMMENDED)**

Untuk development, **tidak perlu setup email**. Sistem sudah berfungsi dengan:
- OTP di console server
- Testing lebih cepat
- Tidak perlu kredensial Gmail

**Cara menggunakan:**
1. Biarkan `.env` seperti sekarang atau comment out EMAIL_USER/EMAIL_PASSWORD
2. Server akan otomatis pakai development mode
3. OTP akan muncul di console saat user request

### **Opsi 2: Test Email dari Laptop Lain**

Coba di laptop/network lain untuk memastikan apakah masalahnya di firewall lokal atau ISP.

### **Opsi 3: Gunakan Service Email Alternatif**

#### **A. Mailtrap (Free, Untuk Development)**

Mailtrap adalah fake SMTP server untuk testing email tanpa kirim sungguhan.

1. Daftar di https://mailtrap.io (gratis)
2. Get credentials dari inbox Anda
3. Update `.env`:
   ```env
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   ```
4. Update `emailService.js` line 26-29:
   ```javascript
   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
   port: parseInt(process.env.EMAIL_PORT) || 465,
   secure: process.env.EMAIL_PORT === '465',
   ```

**Keuntungan Mailtrap:**
- ✅ Tidak diblokir firewall/ISP
- ✅ Bisa test email template tanpa kirim sungguhan
- ✅ Inbox testing yang bagus
- ❌ Email tidak sampai ke user sungguhan (hanya untuk dev)

#### **B. SendGrid (Free 100 email/day)**

1. Daftar di https://sendgrid.com
2. Get API Key
3. Update `.env`:
   ```env
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   ```

#### **C. Mailgun (Free 5,000 email/month)**

1. Daftar di https://mailgun.com
2. Get SMTP credentials
3. Update `.env` dengan SMTP credentials Mailgun

### **Opsi 4: Quick Test - Pakai Nodemailer dengan OAuth2**

Gmail OAuth2 kadang lebih reliable daripada App Password.

**Konfigurasi:**
```javascript
// Di emailService.js, ganti auth section:
auth: {
  type: 'OAuth2',
  user: process.env.EMAIL_USER,
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN
}
```

**Setup OAuth2:**
1. Buat OAuth2 credentials di Google Cloud Console
2. Get refresh token menggunakan OAuth2 Playground
3. Update .env dengan credentials

---

## 🧪 Diagnostic Test

Jalankan test koneksi SMTP dari PowerShell:

```powershell
Test-NetConnection -ComputerName smtp.gmail.com -Port 465
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

**Jika "TcpTestSucceeded : True"** → Port tidak diblokir  
**Jika "TcpTestSucceeded : False"** → Port diblokir firewall/ISP

---

## 💡 Rekomendasi

### **Untuk Development (Sekarang):**
✅ **Pakai Development Mode** - Paling simple, OTP di console  
✅ Atau **Pakai Mailtrap** - Jika ingin test email template

### **Untuk Production (Nanti):**
✅ **Gmail dengan App Password** - Jika network mendukung  
✅ **SendGrid/Mailgun** - Lebih reliable, tidak kena firewall  
✅ **AWS SES** - Murah dan scalable untuk production

---

## 📋 Checklist Troubleshooting

Coba langkah-langkah ini secara berurutan:

- [ ] Test dari network lain (hotspot HP)
- [ ] Disable antivirus/firewall sementara
- [ ] Test koneksi port 465 & 587 dengan PowerShell
- [ ] Coba Mailtrap untuk development
- [ ] Hubungi ISP jika masih gagal
- [ ] Pertimbangkan pakai SendGrid/Mailgun

---

## ✅ Kesimpulan

**Sistem Anda sudah berfungsi dengan baik dalam development mode.**

OTP akan tetap terkirim ke frontend (karena di-return di API response) dan ditampilkan di console untuk reference. Ini **cukup untuk development**.

Email service bisa disetup nanti saat akan production, atau pakai service alternatif seperti SendGrid yang lebih reliable dan tidak kena firewall.

**Tidak perlu pusing dengan connection timeout Gmail untuk development! 🎉**

---

## 🆘 Butuh Bantuan Lebih?

Jika ingin lanjut setup email:
1. Pastikan port 465/587 tidak diblokir (test dengan PowerShell)
2. Coba dari network lain untuk isolasi masalah
3. Atau gunakan Mailtrap untuk development
4. Simpan Gmail untuk production nanti
