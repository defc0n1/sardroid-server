'use strict';

import _       from 'lodash';
import express from 'express';

import models            from '../models';
import { USER, GENERIC } from '../utils/errorTypes.js';
import { verifyJWT }     from '../middleware';

let User = models.User;

let router = express.Router();

router.post('/user/contacts', verifyJWT,  (req, res, next) => {
    let params = req.body;

    if  (params.contactsList) {
        User.findOne({ where: { id: req.user.id }})
            .then( user => {
                return user.update({contactsList: params.contactsList });
            })
            .then( user => {
                res.status(200).json(user.contactsList);
            })
            .catch(err => {
                console.log(err);
                res.err(404, USER.CONTACTS.SAVE_ERROR, 'Error saving contacts list!');
            })
    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Contact list is missing!');
    }
});

router.get('/user/contacts/:state', verifyJWT,  (req, res, next) => {
    let state = req.params.state;

    if (!state || (state !== 'online' && state !== 'offline')) {
        res.err(400, USER.CONTACTS.INVALID_STATE, `Invalid state ${state}`);
    }

    User.findOne({ where: { id: req.user.id }})
        .then( user => {
            res.status(200).json({ contactslist: user.contactsList});
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found');
        })
});

router.get('/user/contacts', verifyJWT,  (req, res, next) => {
    User.findOne({ where: { id: req.user.id }})
        .then( user => {
            res.status(200).json({ contactslist: user.contactsList});
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found');
        })
});


export default router

