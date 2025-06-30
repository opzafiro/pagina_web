

const galeria = document.getElementById('galeria')
const modal = document.getElementById('modal')

const viewer = OpenSeadragon({
    id: "visor",
    prefixUrl: "openseadragon-bin-5.0.1/images/"
});

function agrega_imagen(path){
    let contenedor = document.createElement('div')
    contenedor.setAttribute('class','contenedor')
    contenedor.style.backgroundColor = 'gray'

    let imagen = document.createElement('img')
    imagen.src = path
    
    imagen.addEventListener('click', ()=>{
        viewer.setFullScreen(true);
        viewer.open('imagenes/dzi/imagen1.dzi')
    })
    
    contenedor.appendChild(imagen)
    galeria.appendChild(contenedor)
}


agrega_imagen('imagenes/miniaturas/imagen1.jpg')
