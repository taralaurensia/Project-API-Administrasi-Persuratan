const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('jenis_surat'));
router.get('/:id', getById('jenis_surat', 'id_jenis'));

router.post('/', create('jenis_surat', {
  nama_jenis: null, kode_jenis: null, status_aktif: 'aktif',
  keterangan: null, format_surat: null
}));

router.put('/:id', update('jenis_surat', 'id_jenis', [
  'nama_jenis','kode_jenis','status_aktif','keterangan','format_surat'
]));

router.delete('/:id', remove('jenis_surat', 'id_jenis'));

module.exports = router;
