const express = require('express');
const pool = require('../config/db');
const { getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*,
             sm.nomor_surat AS nomor_surat_masuk,
             sk.nomor_surat AS nomor_surat_keluar
      FROM arsip_surat a
      LEFT JOIN surat_masuk sm ON a.id_surat_masuk = sm.id_surat_masuk
      LEFT JOIN surat_keluar sk ON a.id_surat_keluar = sk.id_surat_keluar
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', getById('arsip_surat', 'id_arsip'));

router.post('/', create('arsip_surat', {
  id_surat_masuk: null, id_surat_keluar: null, lokasi_arsip: null,
  tanggal_arsip: null, tipe_surat: null, versi_digital: null, keamanan_arsip: null
}));

router.put('/:id', update('arsip_surat', 'id_arsip', [
  'id_surat_masuk','id_surat_keluar','lokasi_arsip',
  'tanggal_arsip','tipe_surat','versi_digital','keamanan_arsip'
]));

router.delete('/:id', remove('arsip_surat', 'id_arsip'));

module.exports = router;
