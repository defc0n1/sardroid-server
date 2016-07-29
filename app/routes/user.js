'use strict';

import express from 'express';
import _       from 'lodash';
import crypto  from 'crypto';

import models                       from '../models';
import { verifyJWT, resolveUser }   from '../middleware';
import { connections, EVENT_TYPES } from '../utils/socketIO';

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
    // PeerJS only allows alphanumeric characters in it's ID
    const phoneNumber = req.user.phoneNumber;
    const id = req.user.id;
    const peerJSId = `${phoneNumber}PEER${crypto.randomBytes(10).toString('hex')}`;

    const currentSocket = _.find(connections, socket => {
        return socket.user.id === id;
    });

    if (currentSocket) {
        currentSocket.emit(EVENT_TYPES.ALREADY_LOGGED_IN, {});
    }

    req.user.update({ peerJSId })
    .then((results) => {
        res.status(200).json({ peerJSId });
    });
});


export default router;

