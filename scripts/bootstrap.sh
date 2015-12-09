#!/usr/bin/env bash
# This be the provisioning script for vagrant! Way past cool!

# Export locale env variables

export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
export LANGUAGE="en_US.UTF-8"

sudo apt-get update

sudo apt-get install -y curl

# Install nodejs, because js is best!!!
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install -g babel-cli

# Install dependencies and fire it up!
cd /vagrant/
npm install
npm start & 

