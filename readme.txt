BIBLIOTECA VIRTUAL - ARQUITECTURA DE MICROSERVICIOS (Node.js)
================================================================

Requisitos: Node.js 18 o superior (incluye fetch nativo).

Instalación (una sola vez):

    npm install

Ejecución (levanta los TRES microservicios y la interfaz con un solo comando):

    npm start

En la consola se verá lo siguiente:

    ✓ Microservicio de Usuarios   → http://localhost:8001
    ✓ Microservicio de Libros     → http://localhost:8002
    ✓ Microservicio de Préstamos  → http://localhost:8003

    Biblioteca Virtual lista
    Abre http://localhost:3000 en tu navegador

Abrir http://localhost:3000 y usa el sistema (registrar usuarios, libros y préstamos).
Para detenerlo, Ctrl+C en la terminal.

Nota: aunque todo arranca con un solo comando, cada microservicio sigue siendo
independiente (su propio archivo de datos en /data y su propio puerto). Si se
prefiere, también pueden ejecutarse por separado:

    node services/usuarios.js
    node services/libros.js
    node services/prestamos.js
