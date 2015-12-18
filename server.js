'use strict';

import express from 'express';
import ip      from 'ip';

import { config }  from './utils/';
import auth from './routes/auth';

let app = express();
let port = config.port;

app.use('/auth', auth);

export default app;

