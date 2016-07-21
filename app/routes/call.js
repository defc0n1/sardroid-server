'use strict';

import express from 'express';
import models  from '../models';
import { GENERIC }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;

let router = express.Router();

router.post('/', verifyJWT, resolveUser, (req, res, next) => {
    const params = req.body;

    if (params.recipientNumber) {
        User.findOne({ where: { phoneNumber: params.recipientNumber }})
        .then(user => {
            if (user) {
                user.notifyAbout({ title: `Call from ${req.user.phoneNumber}`,
                                   body: `Call from ${req.user.phoneNumber}` } );
                res.status(201).json({ message: 'Notified user' });
            } else {
                res.err(404, `User with number ${params.recipientNumber} not found`);
            }
        })
        .catch(err => {
            res.err(500, 'Something went wrong!');
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Token is missing!');
    }
});

export default router;

