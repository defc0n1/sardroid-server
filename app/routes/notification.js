'use strict';

import express from 'express';
import models  from '../models';
import { GENERIC, USER }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;

let router = express.Router();

// Route for registering device notification tokens
router.post('/notifications/register', verifyJWT, resolveUser, (req, res, next) => {
    const token = req.body.token;

    if (token) {
        req.user.update({notificationTokens: [ token ]})
        .then(updatedUser => {
            return sendNotification({priority: 'high', data: { hello: 'world'}, notification: { title: "hallp", body: 'booody'}}, [ token ]);
        })
        .then(results => {
            return res.status(200).json({ message: 'Registered device token succesfully'});
        })
        .catch(err => {
            return res.err(400, USER.NOTIFICATIONS.SAVE_FAILED, 'Saving tokens failed!');
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Token is missing!');
    }
});

export default router;

