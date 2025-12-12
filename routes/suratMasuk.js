const express = require('express');
const pool = require('../config/db');
const { getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

// List dengan join dan pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(`
      SELECT sm.*, js.nama_jenis, ps.nama_prioritas, ss.nama_status
      FROM surat_masuk sm
      JOIN jenis_surat js ON sm.id_jenis = js.id_jenis
      JOIN prioritas_surat ps ON sm.id_prioritas = ps.id_prioritas
      JOIN status_surat ss ON sm.id_status = ss.id_status
      LIMIT ? OFFSET ?`, [limit, offset]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM surat_masuk`);
    res.json({ data: rows, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detail + lampiran
router.get('/:id/detail', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(`
      SELECT sm.*, js.nama_jenis, ps.nama_prioritas, ss.nama_status
      FROM surat_masuk sm
      JOIN jenis_surat js ON sm.id_jenis = js.id_jenis
      JOIN prioritas_surat ps ON sm.id_prioritas = ps.id_prioritas
      JOIN status_surat ss ON sm.id_status = ss.id_status
      WHERE sm.id_surat_masuk = ?`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const [lampiran] = await pool.query(`SELECT * FROM lampiran WHERE id_surat_masuk = ?`, [id]);
    res.json({ data: { ...rows[0], lampiran } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', getById('surat_masuk', 'id_surat_masuk'));

router.post('/', create('surat_masuk', {
  id_jenis: null, id_prioritas: null, id_status: null,
  nomor_surat: null, tanggal_terima: null, pengirim: null,
  perihal: null, ringkasan: null, lampiran_count: 0, metode_pengiriman: null
}));

router.put('/:id', update('surat_masuk', 'id_surat_masuk', [
  'id_jenis','id_prioritas','id_status','nomor_surat','tanggal_terima','pengirim',
  'perihal','ringkasan','lampiran_count','metode_pengiriman'
]));

router.delete('/:id', remove('surat_masuk', 'id_surat_masuk'));

module.exports = router;
