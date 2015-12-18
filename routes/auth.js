'use strict';

import express from 'express';
import models  from '../models';

let User = models.User;

let router = express.Router();

router.post('login/:number', (req, res, next) => {
    res.send(200);
});

router.get('/', (req, res, next) => {
    res.send('Hi');
});

export default router

