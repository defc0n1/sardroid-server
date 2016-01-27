#!/bin/env bash

# Interpolate environment variables to json for sequelize migrations
# Bit of a hack, I know!
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

npm run-script serve

exit 0

