

const galeria = document.getElementById('galeria')


function agrega_imagen(path){
    let contenedor = document.createElement('div')
    contenedor.setAttribute('class','contenedor')
    let imagen = document.createElement('img')
    imagen.src = path

    contenedor.appendChild(imagen)
    galeria.appendChild(contenedor)
}

agrega_imagen('imagenes/imagen3.jpg')
