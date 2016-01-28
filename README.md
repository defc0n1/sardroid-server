# Sardroid server

NodeJS express app for brokering connections. run npm install and npm start to start.

Needs babel installed to work, see: https://babeljs.io

For development simply run

```sh

    npm start

```

on your command line. When you're ready to deploy, run

```sh

    npm run-script build

```

and then

```sh

    npm run-script serve

```

to transpile everything to ES5 and start the node server!

## Migrations

This project uses the sequelize CLI to manage migrations and such: http://docs.sequelizejs.com/en/latest/docs/migrations/

So you definitely should

```sh

    npm install -g sequelize-cli

```

If you don't want to install anything globally, you'll have to append each call to the sequelize CLI with ./node_modules/.bin/ to use the locally installed CLI tool.

Migrations were added to this project in the middle of development, so it's sort of a hack job! You're going to have to set up database credentials to both app/utils/config.js and app/config/config.json for now.

## Docker

To run the docker container, specify the necessary environment variables into the sardroid.env file, then pull
up a postgres container from Docher Hub with:


```sh

    docker pull postgres:9.4.5
    docker run --name soardb --env-file sardroid.env -d postgres:9.4.5

```

to spin up the database container with posgres by the name of soardb. Next up, build the image and start it,
linking it together with the postgres container. None of the application code is inside the container, so 
we don't need to rebuild the docker image on miniscule changes. You shouls pass the location to this repository
on the local filesystem with the -v argument.


```sh

    cd ..
    docker build sardroid-server
    docker run --name soar-server --env-file sardroid.env -v <REPO-ABSOLUTE-PATH>/:/sardroid -p 9000:9000 --link soardb:postgres -d <DOCKER-IMAGE-ID>

```

That should do it!
