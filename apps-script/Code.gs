/**
 * Penampung formulir Organisasi Reformis (Google Apps Script + Google Sheets).
 * Tempel seluruh isi file ini di Extensions > Apps Script pada Google Sheet kosong,
 * lalu Deploy > New deployment > Web app (lihat apps-script/README.md).
 *
 * Satu Web App menampung tiga formulir. Tiap formulir masuk ke tab sendiri,
 * tab dan header dibuat otomatis saat data pertama masuk.
 */
var UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ref"];

var FORMS = {
  keresahan: {
    tab: "Keresahan",
    cols: ["waktu", "keresahan", "kategori", "jenis_organisasi", "kontak", "tampil_anonim", "persetujuan"].concat(UTM)
  },
  komunitas: {
    tab: "Komunitas",
    cols: ["waktu", "nama", "kontak", "organisasi_peran", "kontribusi", "persetujuan"].concat(UTM)
  },
  kerjasama: {
    tab: "KerjaSama",
    cols: ["waktu", "nama_organisasi", "jenis_organisasi", "jumlah_anggota", "kota", "pic", "jabatan",
           "kontak", "bentuk_kerja_sama", "keresahan_utama", "persetujuan"].concat(UTM)
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var cfg = FORMS[d.form];
    if (!cfg) return out({ ok: false, error: "form tidak dikenal" });
    if (d.persetujuan !== "ya") return out({ ok: false, error: "tanpa persetujuan" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(cfg.tab) || ss.insertSheet(cfg.tab);
    if (sh.getLastRow() === 0) {
      sh.appendRow(cfg.cols);
      sh.setFrozenRows(1);
    }
    sh.appendRow(cfg.cols.map(function (c) { return clean(d[c]); }));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: "gagal" });
  } finally {
    lock.releaseLock();
  }
}

/** GET ?count=1 mengembalikan jumlah keresahan yang masuk (untuk counter di halaman). */
function doGet(e) {
  if (e && e.parameter && e.parameter.count) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FORMS.keresahan.tab);
    return out({ count: sh ? Math.max(sh.getLastRow() - 1, 0) : 0 });
  }
  return out({ ok: true });
}

/** Batasi panjang dan cegah formula injection di Google Sheets. */
function clean(v) {
  v = (v === undefined || v === null) ? "" : String(v).slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
