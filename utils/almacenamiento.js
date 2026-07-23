const fs = require('fs');
const path = require('path');

// Cada microservicio guarda su información en su propio archivo JSON
// dentro de /data, simulando una base de datos independiente por servicio.
const CARPETA_DATOS = path.join(__dirname, '..', 'data');
if (!fs.existsSync(CARPETA_DATOS)) fs.mkdirSync(CARPETA_DATOS, { recursive: true });

function leer(archivo) {
  const ruta = path.join(CARPETA_DATOS, archivo);
  if (!fs.existsSync(ruta)) return [];
  return JSON.parse(fs.readFileSync(ruta, 'utf8'));
}

function guardar(archivo, datos) {
  const ruta = path.join(CARPETA_DATOS, archivo);
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
}

module.exports = { leer, guardar };
