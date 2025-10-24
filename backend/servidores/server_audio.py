from socket import socket, gethostname
from threading import Thread
from subprocess import Popen, PIPE
from os import mkdir, path
import json

with open('config.json', "r", encoding="utf-8") as f:
        config = json.load(f)

IP= config['ip_servidor']
PORT= config['port_audio']

print(type(IP), IP)
print(type(PORT), PORT)
print(type(config))


def hilo_cliente(client_socket):

    with client_socket:
        filename= b''
        while True:
            data= client_socket.recv(1)
            if not data:   # Cliente cerró conexión
                print("Cliente cerró la conexión.")
                return None
            if data == b'\n':
                break
            filename += data

        filename = filename.decode('utf-8').strip()

        path_directorio = path.join('frontend', 'audios', filename.replace('.mp3', ''))

        mkdir(path_directorio)

        # Ruta final del playlist HLS
        ruta_m3u8 = path.join(path_directorio, 'live.m3u8')


        ffmpeg = Popen([
            'ffmpeg',
            '-f', 'mp3', 
            '-i', '-',
            '-c:a', 'aac', 
            '-b:a', '16k',  #Usa un bitrate de 16 kbps
            '-f', 'hls',    #El formato de salida será HLS
            '-hls_time', '4', #Cada segmento de salida
            '-hls_list_size', '0', #Mantiene toda la lista de segmentos en el archivo .m3u8
            '-hls_flags', 'append_list',#Hace que FFmpeg no borre la lista anterior
            ruta_m3u8   # ✅ salida final
        ], stdin=PIPE)

        print('transfiriendo archivo ...')
        while True:
            data = client_socket.recv(17408)
            if not data:
                print("Cliente cerró la conexión.")
                return None
            ffmpeg.stdin.write(data)


with socket() as server_socket:
    server_socket.bind((IP,PORT))
    server_socket.listen()
    print('servidor activo ip=', IP,'puerto', PORT)

    while True:
        (client_socket, address) = server_socket.accept()
        print('cliente conectado: ', address)
        hilo = Thread(target=hilo_cliente, args=(client_socket,), daemon=True)
        hilo.start()

        
