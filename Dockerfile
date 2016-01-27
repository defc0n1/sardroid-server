FROM ubuntu:14.04
MAINTAINER Matti Jokitulppo <matti.jokitulppo@aalto.fi>

RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

RUN apt-get install -y nodejs
RUN npm install -g babel-cli

RUN mkdir /sardroid

RUN curl -SL https://github.com/melonmanchan/sardroid-server/tarball/master \
    | tar -zxC /sardroid --strip-components=1

ADD . /sardroid

WORKDIR /sardroid

RUN npm install

RUN npm run-script build

EXPOSE 9000

RUN apt-get install postgresql postgresql-contrib

USER postgres

RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER soar WITH SUPERUSER PASSWORD 'soarpassu';" &&\
    createdb -O soar soar

USER root

CMD ["bash", "/sardroid/script/start-server.sh"]

