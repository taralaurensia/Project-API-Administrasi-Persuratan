const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('departemen'));
router.get('/:id', getById('departemen', 'id_departemen'));

router.post('/', create('departemen', {
  nama_departemen: null, kode_departemen: null, kepala_departemen: null,
  keterangan_departemen: null, extension: null, lokasi: null
}));

router.put('/:id', update('departemen', 'id_departemen', [
  'nama_departemen','kode_departemen','kepala_departemen',
  'keterangan_departemen','extension','lokasi'
]));

router.delete('/:id', remove('departemen', 'id_departemen'));

module.exports = router;
