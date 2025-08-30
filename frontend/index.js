const socket = io();


const galeria = document.getElementById('galeria')


const viewer = OpenSeadragon({
    id: "visor",
    prefixUrl: "openseadragon-bin-5.0.1/images/"
});

    
let ultimo_indice = -1
let indice_actual
let imagenes = []
let visores = [] //10 visores para precargar las 10 primeras imagenes
let key_visor_actual=0 // numero de visor donde se va a precargar la nueva imagen
let contenedor_anterior = null

class Imagen {

    constructor(name) {
        this.indice
        this.name= name
        this.etiqueta_imagen = null
    }

    cargar_miniatura(){
        let contenedor = document.createElement('div')
        contenedor.setAttribute('class','contenedor')
        contenedor.style.backgroundColor = 'white'
    
        this.etiqueta_imagen = document.createElement('img')
        this.etiqueta_imagen.src = 'imagenes/miniaturas/'+ this.name
        this.etiqueta_imagen.loading = 'lazy'

        this.etiqueta_imagen.addEventListener('click', ()=>{
            this.seleccionar()
            indice_actual = this.indice
        })
        contenedor.appendChild(this.etiqueta_imagen)
        galeria.appendChild(contenedor)
    }
    cargar_visor(){
        const dzi_name = this.name.replace(/\.[^\.]+$/i, '.dzi')
        viewer.open('imagenes/dzi/'+ dzi_name)
    }
    cargar_fullscreen(){
        viewer.setFullScreen(true);
        this.cargar_visor()
    }

    seleccionar(){
        this.cargar_visor()
        
        if (contenedor_anterior){
            contenedor_anterior.style.backgroundColor = 'orange'
        }
        
        
        this.etiqueta_imagen.parentElement.style.backgroundColor = 'red'

        contenedor_anterior = this.etiqueta_imagen.parentElement
    } 
}
//---------------------------------------------------------------------------------

for(let i=1; i<= 10; i++){
    let vie = OpenSeadragon({
        id: "visor"+i,
        prefixUrl: "openseadragon-bin-5.0.1/images/"
    });
    visores.push(vie)
}

function cargar_imagen(nombre){
    const dzi_name = nombre.replace(/\.[^\.]+$/i, '.dzi')
    visores[key_visor_actual].open('imagenes/dzi/'+ dzi_name)
    key_visor_actual++
    if(key_visor_actual===10){
        key_visor_actual=0
    }
}
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen2.jpg')
cargar_imagen('imagen1.jpg')
cargar_imagen('imagen3.jpg')


//----------------------------------------------------------
socket.on('precarga', (miniaturas) => {

    for (key in miniaturas){
        let im = new Imagen(miniaturas[key])
        im.indice = ultimo_indice +1
        ultimo_indice= ultimo_indice +1
        imagenes.push(im)
        im.cargar_miniatura()
    }
})



socket.on('nueva-imagen', (filename) => {
    console.log(filename)
    let imagen = new Imagen(filename)
    imagen.indice = ultimo_indice + 1
    ultimo_indice= ultimo_indice +1
    imagen.cargar_miniatura()
    imagenes.push(imagen)
    cargar_imagen(filename) //precarga en los 10 visores
    });


document.addEventListener('keydown', (event)=>{
        switch (event.key) {
        case "ArrowLeft":
            if(indice_actual>0){
                indice_actual= indice_actual-1;
                imagenes[indice_actual].seleccionar();
            }
            break;
        case "ArrowRight":
            if(indice_actual< ultimo_indice){
                indice_actual= indice_actual+1;
                imagenes[indice_actual].seleccionar();
            }
            break;
      }
    })