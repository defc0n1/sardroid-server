'use strict';

import express from 'express';
import models  from '../models';
import { resolveUser } from '../middleware';

let User = models.User;

let router = express.Router();

// Route to check if a user is registered
router.get('/:phoneNumber/exists',  (req, res, next) => {
    let phoneNumber = req.params.phoneNumber;
    let jsonResp = { phoneNumber: phoneNumber };

    User.findOne({ where: { phoneNumber: phoneNumber } })
        .then(user => {
            if (user) {
                jsonResp.wasFound = true;
                jsonResp.status = 404;
            } else {
                jsonResp.wasFound = false;
                jsonResp.status = 200;
            }
            res.status(jsonResp.status).json(jsonResp);
        });
});

export default router;

