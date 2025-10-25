const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process');
const multer = require("multer"); //deacargar imagen
const chokidar = require('chokidar')
const config = require(path.join(__dirname, '..', '..', 'config.json'))

const port = config.port_aplicacion

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// servir audios
const audio_dir = path.join(__dirname,'..','..','frontend','audios')
const watcher_audios = chokidar.watch(audio_dir, {recursive: false, ignoreInitial: true})

watcher_audios.on('add',(audio_path) =>{
    let audio_name = path.basename(audio_path)
    if (audio_name == 'live.m3u8'){
      carpeta_path = path.dirname(audio_path)
      carpeta_name = path.basename(carpeta_path)
      console.log(`audio creado: ${audio_path}`)
      io.emit('nuevo-audio', carpeta_name)
    }
})

//servir imagenes-------------------------------------------------
const miniaturas_dir = path.join(__dirname,'..','..',"/frontend/imagenes/miniaturas")
const watcher_imagenes = chokidar.watch(miniaturas_dir, {recursive: false, ignoreInitial: true})

watcher_imagenes.on('add',(miniatura_path) =>{
  let miniatura_name = path.basename(miniatura_path)
  if(!miniatura_name.startsWith('tn_')){
    console.log('se ha creado imagen: ', miniatura_name)
    io.emit('nueva-imagen', miniatura_name)
  }
})
// Servir archivos estáticos (html, css, js, imágenes...)
const sitioPath = path.join(__dirname,'..', '..','frontend')
app.use(express.static(sitioPath));




// precargar -------------------------
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  const miniaturas = fs.readdirSync(miniaturas_dir).sort() // lista de los nombres de las miniaturas
  const audios = fs.readdirSync(audio_dir).sort()
  console.log('miniaturas:\n', miniaturas )
  console.log('audios', audios)
  socket.emit('precarga', miniaturas)
  socket.emit('precarga-audios', audios)
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});
//--------------------------------------------------------------



server.listen(port, () => {
  console.log(`Servidor_galeria en http://localhost:${port}`);
});
