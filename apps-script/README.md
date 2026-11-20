# Penampung formulir (Google Sheets + Apps Script)

1. Buka https://sheets.new dan beri nama "Organisasi Reformis - Respons". Biarkan Sheet kosong dan **jangan dibagikan ke publik**, karena berisi data pribadi.
2. Menu **Extensions > Apps Script**. Hapus isi editor, tempel seluruh isi `Code.gs`, lalu **Save**.
3. **Deploy > New deployment > Select type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy**, izinkan akses saat diminta (Advanced > Go to project).
4. Salin **Web app URL** (berakhiran `/exec`).
5. Di `index.html`, isi bagian `CONFIG`:
   - `endpoints.keresahan`, `endpoints.komunitas`, `endpoints.kerjasama`: semuanya diisi URL yang sama.
   - `counterUrl`: URL yang sama ditambah `?count=1`.
6. Commit dan push. Tab Keresahan, Komunitas, dan KerjaSama dibuat otomatis saat data pertama masuk.

Setiap kali `Code.gs` diubah, buat **New deployment** (atau Manage deployments > edit > New version) agar perubahan berlaku.
