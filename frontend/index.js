const socket = io();


const galeria = document.getElementById('galeria')


const viewer = OpenSeadragon({
    id: "visor",
    prefixUrl: "openseadragon-bin-5.0.1/images/"
});

function agrega_imagen(filename){

    let contenedor = document.createElement('div')
    contenedor.setAttribute('class','contenedor')
    contenedor.style.backgroundColor = 'gray'
    
    let imagen = document.createElement('img')
    imagen.src = 'imagenes/miniaturas/'+filename
    
    imagen.addEventListener('click', ()=>{
        viewer.setFullScreen(true);
        const dzi_filename = filename.replace(/\.[^\.]+$/i, '.dzi')
        viewer.open('imagenes/dzi/'+ dzi_filename)
        contenedor.style.backgroundColor = 'orange'
    })
    
    contenedor.appendChild(imagen)
    galeria.appendChild(contenedor)
}

socket.on('nueva-imagen', (filename) => {
    console.log(filename)
    agrega_imagen(filename)
    });
