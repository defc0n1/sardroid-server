# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = 2

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu/trusty32"
    config.vm.hostname = "SAR-server-dev"

    config.vm.provision :shell, path: "scripts/bootstrap.sh"
    config.vm.network "forwarded_port", guest: 9000, host:9000

    config.vm.provider "virtualbox" do |vb|
        vb.memory = 1024
        vb.cpus = 2
    end
end

