'use strict';

import express from 'express';
import models  from '../models';
import { GENERIC }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;
let Call = models.Call;

let router = express.Router();

router.post('/initiate', verifyJWT, resolveUser, (req, res, next) => {
    const params = req.body;
    let recipientUser = null;

    if (params.recipientNumber) {
        User.findOne({ where: { phoneNumber: params.recipientNumber }})
        .then(user => {
            if (user) {
                user.notifyAbout({ title: `Call from ${req.user.phoneNumber}`,
                                   body: `Call from ${req.user.phoneNumber}` } );

                recipientUser = user;
                return Call.create({
                    startedAt: Date.now()
                });

            } else {
                res.err(404, `User with number ${params.recipientNumber} not found`);
            }
        })
        .then(call =>  {
            return call.addUsers([ recipientUser, req.user ]);
        })
        .then(callWithUsers => {
            return res.status(201).json(callWithUsers[0][0]);
        })
        .catch(err => {
            console.log(err);
            res.err(500, 'Something went wrong!');
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Recipient number is missing!');
    }
});

router.post('/:callID/end', verifyJWT, resolveUser, (req, res, next) => {
    const id = req.params.callID;
    const finalStatus = req.body.finalStatus;

    if (id && finalStatus) {
        Call.findById(id)
        .then(call => {
            return call.update({
                endedAt: Date.now(),
                finalStatus
            });
        })
        .then(updatedCall => {
            res.status(200).json(updatedCall);
        })
        .catch(err => {
            res.err(500, 'Something went wrong!');
        });
    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Call ID or finalStatus is missing!');
    }
});

export default router;

