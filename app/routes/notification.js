'use strict';

import express from 'express';
import models  from '../models';
import { GENERIC }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';

let User = models.User;

let router = express.Router();

// Route for registering device notification tokens
router.post('/register', verifyJWT, resolveUser, (req, res, next) => {
    const token = req.params.token;

    if (token) {
        req.user.update({notificationTokens: [ token ]})
        .then(updatedUser => {

        })
        .catch(err => {
            res.err(500);
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Token is missing!');
    }
});

export default router;

