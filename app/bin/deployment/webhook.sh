#!/usr/bin/env bash

cd /root/sardroid/sardroid-server

git pull

npm install

pm2 stop www

pkill -f "babel"

pm2 start www

exit 0

