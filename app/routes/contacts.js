'use strict';

import _       from 'lodash';
import express from 'express';

import models                     from '../models';
import { USER, GENERIC }          from '../utils/errorTypes.js';
import { connections }            from '../utils/socketIO';
import { verifyJWT, resolveUser } from '../middleware';


let User = models.User;

let router = express.Router();

router.post('/contacts', verifyJWT, resolveUser, (req, res, next) => {
    let params = req.body;

    if  (params.contactsList) {
        console.log('contact list', params.contactsList);
        let numberList = _.map(params.contactsList, 'phoneNumber');
        console.log('numberlist', numberList);
        // First, we reduce the sent contacts list to simply the phone numbers.
        User.findAll({
            attributes: ['phoneNumber'] ,
            where: { phoneNumber: { $in: numberList}}
        })
        .then( registeredNumbers => {

            // Then, we find all the registered users that match the numbers that were sent for syncing.
            console.log('users', registeredNumbers);

            // Finally, we filter the sent contacts list down to those matching registered SoAR users.
            let validContacts = _.filter(params.contactsList, contact => {
                return _.includes(registeredNumbers, contact.phoneNumber);
            });

            console.log('validContacts', validContacts);

            return req.user.update({contactsList: validContacts });
        })
        .then( updatedUser => {
            res.status(200).json(updatedUser.contactsList);
        })
        .catch(err => {
            console.log(err);
            res.err(500, USER.CONTACTS.SAVE_ERROR, 'Error saving contacts list!');
        })

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Contact list is missing!');
    }
});

router.get('/contacts', verifyJWT, resolveUser,  (req, res, next) => {

        let numberList = _.map(req.user.contactsList, 'phoneNumber]');
        User.findAll({where: {phoneNumber: {$in: numberList}}})
        .then( contacts => {
            res.json({contactsList: contacts});
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found');
        })
});

router.get('/contacts/:state', verifyJWT,  (req, res, next) => {
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

export default router

