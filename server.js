'use strict';

import express from 'express';
import ip      from 'ip';
import bodyParser from 'body-parser';
import { config }  from './utils/';
import auth from './routes/auth';

let app = express();

app.use(bodyParser.json())
app.use('/auth', auth);

export default app;

