const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('prioritas_surat'));
router.get('/:id', getById('prioritas_surat', 'id_prioritas'));

router.post('/', create('prioritas_surat', {
  nama_prioritas: null, tingkat_prioritas: null, status_aktif: 'aktif',
  kode_prioritas: null, warna_label: null, keterangan: null
}));

router.put('/:id', update('prioritas_surat', 'id_prioritas', [
  'nama_prioritas','tingkat_prioritas','status_aktif','kode_prioritas','warna_label','keterangan'
]));

router.delete('/:id', remove('prioritas_surat', 'id_prioritas'));

module.exports = router;
