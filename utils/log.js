'use strict';

import chalk from 'chalk'

const LOG_TYPES = {
    INFO  : chalk.green,
    WARN  : chalk.yellow,
    ALERT : chalk.red
};

function log(message, type=LOG_TYPES.INFO) {
   console.log(type(message));
}

export { LOG_TYPES, log }

