# Backend

## funcionamiento
Tenemos dos servidores:
- servidor yolo
- servidor galeria

### servidor yolo
recibe imagen y responde con las coordenadas predichas con el modelo yolo .

## Dependencias

### instalar node.js

``` bash
    # Download and install nvm:
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

    # in lieu of restarting the shell
    \. "$HOME/.nvm/nvm.sh"

    # Download and install Node.js:
    nvm install 22

    # Verify the Node.js version:
    node -v # Should print "v22.17.0".
    nvm current # Should print "v22.17.0".

    # Verify npm version:
    npm -v # Should print "10.9.2".

```

### crear proyecto node.js
```bash
    # En el directorio donde va a estar el servidor
    npm init --yes
```


### instalar dependencias
```bash
    npm i express      #servidor html
    npm i socket.io    #sevidor websocket
    npm i chokidar     # perro guardian
    npm i multer       # descarga imagen
```
### crear dzi
```bash
    sudo apt update
    sudo apt install libvips-tools -y  #instalar vips
    sudo apt install libvips-tools libjpeg-dev libpng-dev -y #verificar
    vips dzsave pu.jpg pu_dzi   #crea archivo .dzi y las carpeta

```
