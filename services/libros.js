const express = require('express');
const cors = require('cors');
const { leer, guardar } = require('../utils/almacenamiento');

const ARCHIVO = 'libros.json';

/**
 * Microservicio de Libros
 * Endpoints:
 *   POST  /                     -> Registrar libro (titulo, autor)
 *   GET   /                     -> Listar libros disponibles
 *   GET   /?id=1                -> Consultar un libro por id (cualquier estado)
 *   PATCH /?id=1&disponible=0   -> Actualizar disponibilidad (usado por Préstamos)
 */
function crearServicioLibros() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/', (req, res) => {
    const { titulo, autor } = req.body || {};
    if (!titulo || !autor) {
      return res.status(400).json({ error: 'Los campos titulo y autor son obligatorios' });
    }
    const libros = leer(ARCHIVO);
    const nuevo = { id: libros.length ? libros[libros.length - 1].id + 1 : 1, titulo, autor, disponible: 1 };
    libros.push(nuevo);
    guardar(ARCHIVO, libros);
    res.status(201).json(nuevo);
  });

  app.get('/', (req, res) => {
    const libros = leer(ARCHIVO);
    if (req.query.id) {
      const libro = libros.find((l) => l.id === Number(req.query.id));
      return res.json(libro || null);
    }
    // Sin id: solo se listan los libros disponibles
    res.json(libros.filter((l) => l.disponible === 1));
  });

  app.patch('/', (req, res) => {
    const id = Number(req.query.id);
    const disponible = Number(req.query.disponible);
    if (!id || Number.isNaN(disponible)) {
      return res.status(400).json({ error: 'Se requieren los parámetros id y disponible' });
    }
    const libros = leer(ARCHIVO);
    const libro = libros.find((l) => l.id === id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    libro.disponible = disponible;
    guardar(ARCHIVO, libros);
    res.json({ ok: true });
  });

  return app;
}

module.exports = crearServicioLibros;

if (require.main === module) {
  crearServicioLibros().listen(8002, () => console.log('Microservicio de Libros en http://localhost:8002'));
}
