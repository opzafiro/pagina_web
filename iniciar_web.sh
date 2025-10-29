#!/bin/bash
#sudo systemctl stop zafiro_server_web.service
sudo cp backend/demonios/zafiro_server_web.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable zafiro_server_web.service
sudo systemctl start zafiro_server_web.service
sudo systemctl status zafiro_server_web.service
