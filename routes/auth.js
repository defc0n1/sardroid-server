'use strict';

import express from 'express';

let router = express.Router();

router.post('login/:number', (req, res, next) => {
    res.send(200);
});

export default router

