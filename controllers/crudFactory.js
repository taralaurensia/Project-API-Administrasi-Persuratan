const pool = require('../config/db');

const list = (table, selectable = '*') => async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(`SELECT ${selectable} FROM ${table} LIMIT ? OFFSET ?`, [limit, offset]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${table}`);
    res.json({ data: rows, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = (table, idCol, selectable = '*') => async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${selectable} FROM ${table} WHERE ${idCol} = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = (table, fields) => async (req, res) => {
  try {
    const keys = Object.keys(fields);
    const values = keys.map(k => req.body[k] ?? fields[k]);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, values);
    res.status(201).json({ data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = (table, idCol, allowed) => async (req, res) => {
  try {
    const keys = Object.keys(req.body).filter(k => allowed.includes(k));
    if (!keys.length) return res.status(400).json({ error: 'No fields to update' });
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => req.body[k]);
    values.push(req.params.id);
    const [result] = await pool.query(`UPDATE ${table} SET ${setClause} WHERE ${idCol} = ?`, values);
    res.json({ data: { affectedRows: result.affectedRows } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = (table, idCol) => async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM ${table} WHERE ${idCol} = ?`, [req.params.id]);
    res.json({ data: { affectedRows: result.affectedRows } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { list, getById, create, update, remove };
