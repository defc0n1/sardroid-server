'use strict';

import express from 'express';
import models  from '../models';
import _        from 'lodash';

import { GENERIC }          from '../utils/errorTypes.js';
import { verifyJWT, resolveUser, resolveCalls } from '../middleware';
import { sendNotification }       from '../utils/pushNotifications';

let User = models.User;
let Call = models.Call;
let UserCall = models.UserCall;

let seq  = models.sequelize;

let router = express.Router();

router.post('/initiate', verifyJWT, resolveUser, (req, res, next) => {
    const params = req.body;
    let recipientUser = null;
    let createdCall  = null;

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
            createdCall = call;

            return createdCall.addUser(recipientUser, { type: 'recipient'})
        })
        .then(call =>  {
            return createdCall.addUser(req.user, { type: 'caller' })
        })
        .then(callWithUsers => {
            console.log(createdCall);
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
        Call.findById(id, { include: [ User ] })
        .then(call => {

            let isPartOfCall =  _.some(call.Users, (user) => {
                return user.dataValues.id === req.user.id;
            });

            if (!isPartOfCall) {
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
            res.err(500, 'Something went wrong!');
        });
    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Call ID or finalStatus is missing!');
    }
});

router.get('/', resolveCalls,  (req, res, next) => {
    const callIDs = req.calls.map( call => {
        return call.dataValues.CallId
    });

    seq.query(`
              SELECT "Users"."phoneNumber", "Users"."id" AS "userID", "Calls"."finalStatus", "UserCalls"."type", "Calls"."startedAt", "Calls"."endedAt"
              FROM "Calls" JOIN "UserCalls" ON "UserCalls"."CallId" = "Calls"."id"
              JOIN "Users" ON "Users"."id" = "UserCalls"."UserId"
              WHERE "Calls"."finalStatus" IS NOT NULL
              AND "Calls".id IN (${ callIDs.join() })
              ORDER BY "Calls"."startedAt";`,
              { type: seq.QueryTypes.SELECT })
    .then( call => {
        res.json(call);
    })
    .catch( err => {
        res.err(500, err);
    })
});

export default router;

