'''
El servidor recibe imagenes y las guarda en frontend/imagenes/originales/filename.jpg
el cliente debe enviar:
    nombre_de_imagen + '\n + tamaño_de_imagen + archivo

despues crea el dzi y la miniatura

'''
from socket import socket
import json
from os import path, rename
from threading import Thread
from subprocess import Popen

with open('config.json', 'r') as f:
    config = json.load(f)


HOST = config['ip_servidor']
PORT = config['port_imagen']

def crea_miniatura_dzi(path_imagen):
    imagen_name = path.basename(path_imagen)

    dzi_path= path.join('frontend', 'imagenes', 'dzi', imagen_name)
    dzi = Popen(['vips', 'dzsave', path_imagen, dzi_path.replace('.jpg', '')])
    dzi.wait()

    miniatura_path = path.join('.', '..', 'miniaturas') #relativo al archivo de entrada de vipsthumbnail
    miniatura = Popen(['vipsthumbnail', '--size', '200', '-o', f'{miniatura_path}/tn_%s.jpg', path_imagen])
    miniatura.wait()
    path_inicial = path.join('frontend', 'imagenes', 'miniaturas', 'tn_'+imagen_name)
    path_final = path.join('frontend', 'imagenes', 'miniaturas', imagen_name)
    rename(path_inicial,path_final)

def hilo_cliente(conn):
    with conn:
        while True:
        
            filename= b''

            while not filename.endswith(b'\n'): # recibe nombre del archivo
                data= conn.recv(1)
                if not data:   # Cliente cerró conexión
                    print("Cliente cerró la conexión.")
                    return None
                
                filename += data
            
            filename= filename.strip().decode()

            data = conn.recv(4) # recive tamaño del archivo
            if not data:   # Cliente cerró conexión
                    print("Cliente cerró la conexión.")
                    return None

            file_size= int.from_bytes(data, byteorder='big')

            print('Transfiriendo archivo: ', filename,' de ', file_size, 'bytes')

            path_file= path.join('frontend','imagenes','originales', filename)
            with open(path_file,'wb') as file:
                bytes_recibidos=0
                while bytes_recibidos<file_size:
                    data = conn.recv(min(1024, file_size-bytes_recibidos))
                    if not data:
                        break
                    file.write(data)
                    bytes_recibidos += len(data)
                print('Archivo transferido')

            hilo_miniatura_dzi = Thread(target=crea_miniatura_dzi, args=(path_file,))
            hilo_miniatura_dzi.start()


with socket() as s:
    s.bind((HOST, PORT))
    s.listen()
    print('servidor imagen activo ip = ', HOST, 'puerto', PORT)
    while True:
        conn, addr=s.accept()
        print('cliente conectado: ', addr)
        hilo = Thread(target=hilo_cliente, args=(conn,), daemon=True)
        hilo.start()
    



    