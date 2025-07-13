import sys
from PIL import Image
import os

def redimensionar_imagen(path_imagen, path_destino, ancho_deseado=150):
    try:
        with Image.open(path_imagen) as img:
            ancho_original, alto_original = img.size
            alto_nuevo = int((ancho_deseado / ancho_original) * alto_original)
            img_redimensionada = img.resize((ancho_deseado, alto_nuevo))
            img_redimensionada.save(path_destino)
            print(f"✅ Imagen redimensionada y guardada en: {path_destino}")
    except Exception as e:
        print(f"❌ Error al redimensionar imagen: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python redimensionar.py path_imagen path_destino")
        sys.exit(1)

    path_imagen = sys.argv[1]
    path_destino = sys.argv[2]

    redimensionar_imagen(path_imagen, path_destino)
