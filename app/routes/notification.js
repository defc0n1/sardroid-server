'use strict';

import express from 'express';
import _       from 'lodash';
import models  from '../models';
import { GENERIC, USER }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;

let router = express.Router();

// Route for registering device notification tokens
router.post('/notifications/register', verifyJWT, resolveUser, (req, res, next) => {
    const deviceToken = req.body.deviceToken;

    if (deviceToken) {
        let tokens = [];

        if (req.user.dataValues.notificationTokens) {
            tokens = req.user.dataValues.notificationTokens;
        }

        if (! _.includes(deviceToken, tokens)) {
            tokens.push(deviceToken);
        }

        req.user.update({ notificationTokens: tokens })
        .then(results => {
            return res.status(200).json({ message: 'Registered device token succesfully' });
        })
        .catch(err => {
            return res.err(400, USER.NOTIFICATIONS.SAVE_FAILED, 'Saving tokens failed!');
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Token is missing!');
    }
});

export default router;

