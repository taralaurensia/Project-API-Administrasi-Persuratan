const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('status_surat'));
router.get('/:id', getById('status_surat', 'id_status'));

router.post('/', create('status_surat', {
  nama_status: null, deskripsi: null, kategori_status: null,
  kode_status: null, warna_status: null, final_status: 'tidak'
}));

router.put('/:id', update('status_surat', 'id_status', [
  'nama_status','deskripsi','kategori_status','kode_status','warna_status','final_status'
]));

router.delete('/:id', remove('status_surat', 'id_status'));

module.exports = router;
