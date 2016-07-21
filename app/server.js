'use strict';

import bodyParser  from 'body-parser';
import compression from 'compression'
import cors        from 'cors';
import express     from 'express';
import rollbar     from 'rollbar';

import auth          from './routes/auth';
import call          from './routes/call';
import contacts      from './routes/contacts';
import notifications from './routes/notification';
import user          from './routes/user';

import jsonErr     from './middleware/jsonErr.js';
import { config }  from './utils/';

let app = express();

app.use(rollbar.errorHandler(config.rollbar.postToken, {
    environment: process.env.NODE_ENV || 'development'
}));

app.use(compression());
app.use(jsonErr);
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

app.use('/auth', auth);
app.use('/call', call);
app.use('/user', contacts);
app.use('/user', notifications);
app.use('/user', user);

export default app;

