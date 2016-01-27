#!/bin/env bash

# Interpolate environment variables to json for sequelize migrations
# These variables are ideally read from the sardroid.env file when
# spinning up the Docker container with docker start.
cat << EOF > /sardroid/app/config/config.json
{
    production: {
        host     : "${POSTGRES_HOST}",
        username : "${POSTGRES_USER}",
        password : "${POSTGRES_PASSWORD}",
        database : "${POSTGRES_DB}",
        charset  : "${POSTGRES_CHARSET}",
        dialect  : "postgres"
    }
}
EOF

sequelize db:migrate

npm run-script build

npm run-script serve

exit 0

