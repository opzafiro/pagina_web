const express = require('express');
const path = require('path');
const app = express();
const port = 3030;

// Ruta a tu sitio web completo
const sitioPath = '/home/bicycle/Desktop/pagina_web/frontend';

// Servir archivos estáticos (html, css, js, imágenes...)
app.use(express.static(sitioPath));

// Enviar index.html por defecto al entrar a "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(sitioPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor web en http://localhost:${port}`);
});
