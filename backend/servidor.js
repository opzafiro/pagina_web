const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const chokidar = require('chokidar')
const path = require('path')
const port = 3030;

const app = express()
const server = http.createServer(app)
const io = new Server(server)


// Servir archivos estáticos (html, css, js, imágenes...)

const sitioPath = '/home/bicycle/Desktop/pagina_web/frontend';

app.use(express.static(sitioPath));
//-----------------------------------------------------------

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Vigilar carpeta de imágenes
const watcher = chokidar.watch('/home/bicycle/Desktop/pagina_web/frontend/imagenes/originales', {
  ignoreInitial: true
});


watcher.on('add', (filepath) => {
  const filename = path.basename(filepath);
  console.log(`Imagen nueva: ${filename}`);
  io.emit('nueva-imagen', filename);
});
//---------------------------------------------

server.listen(port, () => {
  console.log(`Servidor web en http://localhost:${port}`);
});
