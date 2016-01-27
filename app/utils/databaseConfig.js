'use strict'

module.exports = {
  "development": {
            "host"     : process.env.POSTGRES_HOST    || 'localhost',
            "username" : process.env.POSTGRES_USER    || 'postgres',
            "password" : process.env.POSTGRES_PASSWORD|| 'supersalainensalasana',
            "database" : process.env.POSTGRES_DB      || 'soar',
            "charset"  : process.env.POSTGRES_CHARSET || 'utf8',
            "dialect"  : 'postgres'

  },
  "production": {
            "host"     : process.env.POSTGRES_HOST    || 'localhost',
            "username" : process.env.POSTGRES_USER    || 'postgres',
            "password" : process.env.POSTGRES_PASSWORD|| 'supersalainensalasana',
            "database" : process.env.POSTGRES_DB      || 'soar',
            "charset"  : process.env.POSTGRES_CHARSET || 'utf8',
            "dialect"  : 'postgres'

  }
}

