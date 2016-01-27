#!/bin/env bash

mkdir /sardroid/dist/config
cat << EOF > /sardroid/dist/config/config.json
{
    production: {
        host: "${POSTGRES_HOST}",
        username: "${POSTGRES_USER}",
        password: "${POSTGRES_PASSWORD}",
        database: "${POSTGRES_DB}",
        charset: "${POSTGRES_CHARSET}",
        dialect: "postgres"
    }
}
EOF


npm run-script serve

exit 0

