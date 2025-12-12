const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { list, getById, update, remove } = require('../controllers/crudFactory');
const router = express.Router();

router.get('/', list('user'));
router.get('/:id', getById('user', 'id_user'));

router.post('/', async (req, res) => {
  try {
    const { nama_user, username, no_hp, email, password, jabatan, tanggal_bergabung } = req.body;
    if (!password) return res.status(400).json({ error: 'Password wajib diisi' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(`
      INSERT INTO user (nama_user, username, no_hp, email, password, jabatan, tanggal_bergabung)
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [nama_user, username, no_hp, email, hash, jabatan, tanggal_bergabung]);
    res.status(201).json({ data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', update('user', 'id_user', [
  'nama_user','username','no_hp','email','jabatan','tanggal_bergabung'
]));

router.delete('/:id', remove('user', 'id_user'));

module.exports = router;
