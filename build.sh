#!/bin/bash

mkdir -p frontend/imagenes/dzi frontend/imagenes/miniaturas frontend/imagenes/originales
mkdir -p frontend/audios
#Node------------------------------------------------
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22.17.0
node -v # Should print "v22.17.0".
nvm current # Should print "v22.17.0".
    # Verify npm version:
npm -v # Should print "10.9.2".

cd backend
npm i

# paquetes para hacer los dzi--------------------------------
sudo apt update
sudo apt install libvips-tools libjpeg62-turbo


