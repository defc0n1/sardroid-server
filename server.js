'use strict';

import express from 'express';
import ip      from 'ip';

import { config }  from './utils/';

let app = express();
let port = config.port;

app.get('/', (req, res, next) => { res.send('Hello world!'); });

export default app;

