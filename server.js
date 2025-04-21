// server.js
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;
const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.192',
  database: 'price_discovery',
  password: 'postgres',
  port: 5432,
});
// Servir archivos estáticos (HTML, JS, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir cualquier ruta a index.html
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sucursales', async (req, res) => {
  try {
    const result = await pool.query('SELECT sucursales_latitud, sucursales_longitud, sucursales_nombre FROM sucursales');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get('/sucursales2', async (req, res) => {
  try {
    const result = await pool.query("select * from increments_avg;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
