const express = require('express')
const { spawn } = require('child_process');
const multer = require("multer"); //deacargar imagen
const path = require('path');

const port = 2020;

const app = express()
const downloadDir = path.join(__dirname,'..','frontend/imagenes/miniaturas' );


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, downloadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // 👈 Aquí se conserva el nombre original
    }
});

const upload = multer({ storage: storage });

//app.use(express.json())

app.post('/',upload.single("imagen") ,(req,res) =>{
    const python = spawn('python3', ['backend/yolo.py', 'Hola Node']);
    python.stdout.on('data', (data) => {
        const coordenadas = data.toString()
        console.log(`Salida de Python: ${coordenadas}`);
        res.send(coordenadas)  
    });

})



app.listen(port, ()=>{
    console.log(`servidor_yolo encendido localhost:${port}`)})