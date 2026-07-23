const express = require('express');
const cors = require('cors');
const { leer, guardar } = require('../utils/almacenamiento');

const ARCHIVO = 'prestamos.json';
const URL_USUARIOS = 'http://localhost:8001/';
const URL_LIBROS = 'http://localhost:8002/';

// Este servicio no guarda datos de usuarios ni libros: los consulta
// en tiempo real llamando a las APIs de los otros microservicios.
async function consultarServicio(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    return await respuesta.json();
  } catch {
    return null;
  }
}

/**
 * Microservicio de Préstamos
 * Endpoints:
 *   POST /   -> Registrar préstamo (usuario_id, libro_id)
 *   GET  /   -> Consultar historial de préstamos
 */
function crearServicioPrestamos() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/', async (req, res) => {
    const { usuario_id, libro_id } = req.body || {};
    if (!usuario_id || !libro_id) {
      return res.status(400).json({ error: 'usuario_id y libro_id son obligatorios' });
    }

    // 1. Validar que el usuario exista (llamada al microservicio de Usuarios)
    const usuario = await consultarServicio(`${URL_USUARIOS}?id=${usuario_id}`);
    if (!usuario) return res.status(404).json({ error: 'El usuario no existe' });

    // 2. Validar que el libro exista y esté disponible (llamada al microservicio de Libros)
    const libro = await consultarServicio(`${URL_LIBROS}?id=${libro_id}`);
    if (!libro || libro.disponible !== 1) {
      return res.status(409).json({ error: 'El libro no existe o no está disponible' });
    }

    // 3. Registrar el préstamo
    const prestamos = leer(ARCHIVO);
    const nuevo = {
      id: prestamos.length ? prestamos[prestamos.length - 1].id + 1 : 1,
      usuario_id: Number(usuario_id),
      libro_id: Number(libro_id),
      fecha: new Date().toISOString(),
    };
    prestamos.push(nuevo);
    guardar(ARCHIVO, prestamos);

    // 4. Marcar el libro como no disponible (PATCH al microservicio de Libros)
    await fetch(`${URL_LIBROS}?id=${libro_id}&disponible=0`, { method: 'PATCH' });

    res.status(201).json({ id: nuevo.id, usuario: usuario.nombre, libro: libro.titulo, fecha: nuevo.fecha });
  });

  app.get('/', async (req, res) => {
    const prestamos = leer(ARCHIVO);
    const historial = await Promise.all(
      prestamos.map(async (p) => {
        const usuario = await consultarServicio(`${URL_USUARIOS}?id=${p.usuario_id}`);
        const libro = await consultarServicio(`${URL_LIBROS}?id=${p.libro_id}`);
        return {
          id: p.id,
          usuario: usuario ? usuario.nombre : 'Desconocido',
          libro: libro ? libro.titulo : 'Desconocido',
          fecha: p.fecha,
        };
      })
    );
    historial.reverse(); // más reciente primero
    res.json(historial);
  });

  return app;
}

module.exports = crearServicioPrestamos;

if (require.main === module) {
  crearServicioPrestamos().listen(8003, () => console.log('Microservicio de Préstamos en http://localhost:8003'));
}
