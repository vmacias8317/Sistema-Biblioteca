const express = require('express');
const cors = require('cors');
const { leer, guardar } = require('../utils/almacenamiento');

const ARCHIVO = 'usuarios.json';

/**
 * Microservicio de Usuarios
 * Endpoints:
 *   POST /            -> Registrar usuario (nombre, correo)
 *   GET  /             -> Listar todos los usuarios
 *   GET  /?id=1         -> Consultar un usuario por id
 */
function crearServicioUsuarios() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/', (req, res) => {
    const { nombre, correo } = req.body || {};
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'Los campos nombre y correo son obligatorios' });
    }
    const usuarios = leer(ARCHIVO);
    const nuevo = { id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1, nombre, correo };
    usuarios.push(nuevo);
    guardar(ARCHIVO, usuarios);
    res.status(201).json(nuevo);
  });

  app.get('/', (req, res) => {
    const usuarios = leer(ARCHIVO);
    if (req.query.id) {
      const usuario = usuarios.find((u) => u.id === Number(req.query.id));
      return res.json(usuario || null);
    }
    res.json(usuarios);
  });

  return app;
}

module.exports = crearServicioUsuarios;

// Permite además ejecutar este microservicio de forma aislada: node services/usuarios.js
if (require.main === module) {
  crearServicioUsuarios().listen(8001, () => console.log('Microservicio de Usuarios en http://localhost:8001'));
}
