const path = require('path');
const express = require('express');

const crearServicioUsuarios = require('./services/usuarios');
const crearServicioLibros = require('./services/libros');
const crearServicioPrestamos = require('./services/prestamos');

const PUERTO_USUARIOS = 8001;
const PUERTO_LIBROS = 8002;
const PUERTO_PRESTAMOS = 8003;
const PUERTO_CLIENTE = 3000;

// Los tres microservicios siguen siendo independientes entre sí (cada uno
// con su propio archivo de datos y su propio puerto); lo único que hace
// este archivo es arrancarlos a los tres desde un mismo comando.
crearServicioUsuarios().listen(PUERTO_USUARIOS, () =>
  console.log(`✓ Microservicio de Usuarios   → http://localhost:${PUERTO_USUARIOS}`)
);
crearServicioLibros().listen(PUERTO_LIBROS, () =>
  console.log(`✓ Microservicio de Libros     → http://localhost:${PUERTO_LIBROS}`)
);
crearServicioPrestamos().listen(PUERTO_PRESTAMOS, () =>
  console.log(`✓ Microservicio de Préstamos  → http://localhost:${PUERTO_PRESTAMOS}`)
);

// Servidor estático para el cliente web (carpeta /public)
const cliente = express();
cliente.use(express.static(path.join(__dirname, 'public')));
cliente.listen(PUERTO_CLIENTE, () => {
  console.log('');
  console.log('================================================');
  console.log('  Biblioteca Virtual lista');
  console.log(`  Abre http://localhost:${PUERTO_CLIENTE} en tu navegador`);
  console.log('================================================');
});
