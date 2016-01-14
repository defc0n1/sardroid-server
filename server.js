'use strict';

import bodyParser  from 'body-parser';
import compression from 'compression'
import cors        from 'cors';
import express     from 'express';
import ip          from 'ip';
import rollbar     from 'rollbar';

import { config }  from './utils/';
import auth        from './routes/auth';
import jsonErr     from './middleware/jsonErr.js';

let app = express();

app.use(rollbar.errorHandler(config.rollbar.postToken));
app.use(compression());
app.use(jsonErr);
app.use(cors());
app.use(bodyParser.json())
app.use('/auth', auth);

export default app;

