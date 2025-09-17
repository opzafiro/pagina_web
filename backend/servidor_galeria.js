const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process');
const multer = require("multer"); //deacargar imagen

const port = 3030;
const downloadDir = path.join(__dirname,'..','frontend/imagenes/originales' );

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Servir archivos estáticos (html, css, js, imágenes...)
const miniaturas_dir = path.join(__dirname,'..',"/frontend/imagenes/miniaturas")
const originales_dir = path.join(__dirname,'..','frontend/imagenes/originales')
const dzi_dir = path.join(__dirname,'..','frontend/imagenes/dzi')
const sitioPath = path.join(__dirname,'..','frontend')
//======Recibir imagen==============================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, downloadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // 👈 Aquí se conserva el nombre original
    }
});

const upload = multer({ storage: storage });

app.post('/',upload.single("imagen") ,(req,res) =>{
  res.send('imagen recibida')
  console.log('imagen recibida')

  const filename = req.file.filename
  console.log(`Imagen nueva: ${filename}`);
  let name = filename.replace(/\.[^\.]+$/i, '')

  const vips = spawn('vips', ['dzsave', path.join(downloadDir,filename), path.join(dzi_dir, name)]);
  vips.stdout.on('data', data => console.log(`stdout: ${data}`));
  vips.stderr.on('data', data => console.error(`stderr: ${data}`));

  vips.on('close', code => {
    if (code === 0) {
      console.log("✅ Conversión terminada:", filename);
      io.emit('nueva-imagen', filename);
    } else {
      console.error(`Proceso terminó con código ${code}`);
    }
  });

})
//===================================================

app.use(express.static(sitioPath));

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  const miniaturas = fs.readdirSync(miniaturas_dir).sort() // lista de los nombres de las miniaturas
  console.log(miniaturas)
  socket.emit('precarga', miniaturas)
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});




server.listen(port, () => {
  console.log(`Servidor_galeria en http://localhost:${port}`);
});
