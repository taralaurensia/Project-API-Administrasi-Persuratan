const express = require('express');
const pool = require('../config/db');
const { getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(`
      SELECT sk.*, js.nama_jenis, ps.nama_prioritas, ss.nama_status
      FROM surat_keluar sk
      JOIN jenis_surat js ON sk.id_jenis = js.id_jenis
      JOIN prioritas_surat ps ON sk.id_prioritas = ps.id_prioritas
      JOIN status_surat ss ON sk.id_status = ss.id_status
      LIMIT ? OFFSET ?`, [limit, offset]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM surat_keluar`);
    res.json({ data: rows, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', getById('surat_keluar', 'id_surat_keluar'));

router.post('/', create('surat_keluar', {
  id_jenis: null, id_prioritas: null, id_status: null,
  nomor_surat: null, tanggal_kirim: null, tujuan: null,
  tembusan: null, metode_pengiriman: null, perihal: null, ringkasan: null
}));

router.put('/:id', update('surat_keluar', 'id_surat_keluar', [
  'id_jenis','id_prioritas','id_status','nomor_surat','tanggal_kirim','tujuan',
  'tembusan','metode_pengiriman','perihal','ringkasan'
]));

router.delete('/:id', remove('surat_keluar', 'id_surat_keluar'));

module.exports = router;
