const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('API Administrasi Persuratan'));

// Mount routes
app.use('/api/jenis-surat', require('./routes/jenisSurat'));
app.use('/api/prioritas-surat', require('./routes/prioritasSurat'));
app.use('/api/status-surat', require('./routes/statusSurat'));
app.use('/api/surat-masuk', require('./routes/suratMasuk'));
app.use('/api/lampiran', require('./routes/lampiran'));
app.use('/api/surat-keluar', require('./routes/suratKeluar'));
app.use('/api/user', require('./routes/user'));
app.use('/api/disposisi', require('./routes/disposisi'));
app.use('/api/departemen', require('./routes/departemen'));
app.use('/api/arsip-surat', require('./routes/arsipSurat'));

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
