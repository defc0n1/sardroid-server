'use strict';

import express from 'express';
import models  from '../models';
import { verifyJWT, resolveUser } from '../middleware';
import crypto from 'crypto';

let User = models.User;

let router = express.Router();

// Route to check if a user is registered
router.get('/:phoneNumber/exists', verifyJWT, (req, res, next) => {
    let phoneNumber = req.params.phoneNumber.replace(/[+ ]/, '');
    let found = false;

    User.findOne({ where: { phoneNumber: phoneNumber } })
        .then(user => {
            if (user) {
                found = true;
            }

            res.status(200).json({ found: found, phoneNumber: phoneNumber });
        });
});

router.get('/generatePeerId', verifyJWT, resolveUser, (req, res, next) => {
    const peerJSId = `${req.user.phoneNumber}PEER${crypto.randomBytes(10).toString('hex')}`;

    req.user.update({ peerJSId })
    .then((results) => {
        res.status(200).json({ peerJSId });
    });
});


export default router;

