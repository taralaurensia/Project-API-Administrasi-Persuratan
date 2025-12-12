const express = require('express');
const pool = require('../config/db');
const { list, getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('lampiran'));
router.get('/:id', getById('lampiran', 'id_lampiran'));

router.get('/surat-masuk/:id_surat_masuk', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM lampiran WHERE id_surat_masuk = ?`, [req.params.id_surat_masuk]);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', create('lampiran', {
  id_surat_masuk: null, nama_file: null, ukuran_file: null,
  tipe_file: null, path_file: null, uploader: null, hash_file: null
}));

router.put('/:id', update('lampiran', 'id_lampiran', [
  'nama_file','ukuran_file','tipe_file','path_file','uploader','hash_file'
]));

router.delete('/:id', remove('lampiran', 'id_lampiran'));

module.exports = router;
