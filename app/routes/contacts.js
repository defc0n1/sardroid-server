'use strict';

import _       from 'lodash';
import express from 'express';

import models            from '../models';
import { USER, GENERIC } from '../utils/errorTypes.js';
import { verifyJWT }     from '../middleware';

let User = models.User;

let router = express.Router();

router.post('/user/contactslist', verifyJWT,  (req, res, next) => {

});

router.get('/user/contacts', verifyJWT,  (req, res, next) => {
    User.findOne({ where: { id: req.user.id }})
        .then( user => {
            res.status(200).json({ contactslist: user.contactsList})
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found')
        })
});


export default router

