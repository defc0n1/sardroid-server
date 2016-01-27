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

##Migrations

This project uses the sequelize CLI to manage migrations and such: http://docs.sequelizejs.com/en/latest/docs/migrations/

So you definitely should

```sh

    npm install -g sequelize-cli

```

If you don't want to install anything globally, you'll have to append each call to the sequelize CLI with ./node_modules/.bin/ to use the locally installed CLI tool.

Migrations were added to this project in the middle of development, so it's sort of a hack job! You're going to have to set up database credentials to both app/utils/config.js and app/config/config.json for now.
