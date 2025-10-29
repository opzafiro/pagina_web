#!/bin/bash
#sudo systemctl stop zafiro_server_imagen.service
sudo cp backend/demonios/zafiro_server_imagen.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable zafiro_server_imagen.service
sudo systemctl start zafiro_server_imagen.service
sudo systemctl status zafiro_server_imagen.service

