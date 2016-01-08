'use strict';

import express     from 'express';
import bodyParser  from 'body-parser';
import compression from 'compression'
import ip          from 'ip';
import cors        from 'cors';
import { config }  from './utils/';
import auth        from './routes/auth';
import jsonErr     from './middleware/jsonErr.js';

let app = express();

app.use(compression());
app.use(jsonErr);
app.use(cors());
app.use(bodyParser.json())
app.use('/auth', auth);

export default app;

