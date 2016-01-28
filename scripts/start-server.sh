#!/bin/env bash
# Deployment script that pulls changes from GitHub and starts serving the app

git pull

npm install

sequelize db:migrate

npm run-script build

npm run-script serve

exit 0

