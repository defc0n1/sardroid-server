'use strict';

import express    from 'express';
import ip         from 'ip';
import bodyParser from 'body-parser';
import cors       from 'cors';
import { config } from './utils/';
import auth       from './routes/auth';
import jsonErr    from './middleware/jsonErr.js';

let app = express();
app.use(jsonErr);
app.use(cors());
app.use(bodyParser.json())
app.use('/auth', auth);

export default app;

