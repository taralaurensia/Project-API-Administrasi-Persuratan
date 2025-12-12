const express = require('express');
const pool = require('../config/db');
const { getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, u.nama_user, sm.nomor_surat
      FROM disposisi d
      JOIN user u ON d.id_user = u.id_user
      JOIN surat_masuk sm ON d.id_surat_masuk = sm.id_surat_masuk
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', getById('disposisi', 'id_disposisi'));

router.post('/', create('disposisi', {
  id_surat_masuk: null, id_user: null, status_disposisi: null,
  tanggal_disposisi: null, instruksi: null, batas_waktu: null, catatan: null
}));

router.put('/:id', update('disposisi', 'id_disposisi', [
  'status_disposisi','tanggal_disposisi','instruksi','batas_waktu','catatan'
]));

router.delete('/:id', remove('disposisi', 'id_disposisi'));

module.exports = router;
