'use strict';

import express from 'express';
import models  from '../models';
import _        from 'lodash';

import { GENERIC }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;
let Call = models.Call;
let UserCall = models.UserCall;

let seq  = models.sequelize;

let router = express.Router();

router.post('/initiate', verifyJWT, resolveUser, (req, res, next) => {
    const params = req.body;

    if (params.recipientNumber) {
        User.findOne({ where: { phoneNumber: params.recipientNumber }})
        .then(user => {
            if (user) {
                user.notifyAbout({ title: `Call from ${req.user.phoneNumber}`,
                                   body: `Call from ${req.user.phoneNumber}` } );

                return Call.create({
                    startedAt: Date.now(),
                    callerId: req.user.id,
                    recipientId: user.dataValues.id
                });

            } else {
                res.err(404, `User with number ${params.recipientNumber} not found`);
            }
        })
        .then(createdCall => {
            return res.status(201).json(createdCall);
        })
        .catch(err => {
            console.log(err);
            res.err(500, 'Something went wrong!');
        });

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Recipient number is missing!');
    }
});

router.put('/:callID/end', verifyJWT, resolveUser, (req, res, next) => {
    const id = req.params.callID;
    const finalStatus = req.body.finalStatus;

    if (id && finalStatus) {
        Call.findById(id)
        .then(call => {
            if (!call.dataValues.callerId === req.user.id) {
                return res.err(403, 'You are not a participant in this call!');
            }

            return call.update({
                endedAt: Date.now(),
                finalStatus
            });
        })
        .then(updatedCall => {
            res.status(200).json(updatedCall);
        })
        .catch(err => {
            console.log(err);
            res.err(500, 'Something went wrong!');
        });
    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Call ID or finalStatus is missing!');
    }
});

router.get('/', (req, res, next) => {

    Call.findAll({
        where: {
            $or: [
                {
                    recipientId: { $eq: req.user.id }
                },
                {
                    callerId: { $eq: req.user.id }
                }
            ]
        },
        include: [
            {
                model: User,
                as: 'recipient',
                attributes: ['phoneNumber']
            },
            {
                model: User,
                as: 'caller',
                attributes: ['phoneNumber']
            }
        ]
    })
    .then( calls => {
        res.json(calls);
    })
    .catch( err => {
        res.err(500, err);
    })
});

export default router;

