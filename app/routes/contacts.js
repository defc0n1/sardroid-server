'use strict';

import _       from 'lodash';
import express from 'express';

import models            from '../models';
import { USER, GENERIC } from '../utils/errorTypes.js';
import { connections }   from '../utils/socketIO';
import { verifyJWT }     from '../middleware';


let User = models.User;

let router = express.Router();

router.post('/user/contacts', verifyJWT,  (req, res, next) => {
    let params = req.body;

    if  (params.contactsList) {
        console.log('contact list', params.contactsList);
        User.findOne({ where: { id: req.user.id }})
            .then( user => {

                let numberList = _.map(params.contactsList, 'phoneNumber]');
                console.log('numberlist', numberList);
                return User.findAll({
                    attributes: ['phoneNumber'] ,
                    where: { phoneNumber: { $in: numberList}}
                })
            })
            .then( users => {
                console.log('users', users);
                if (users) {
                    let validContacts = _.filter(params.contactsList, contact => {
                        return _.contains(users, contact);
                    })
                    return user.update({contactsList: validContacts });
                }
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

router.get('/user/contacts', verifyJWT,  (req, res, next) => {

    User.findOne({ where: { id: req.user.id }})
        .then( user => {
            let numberList = _.map(user.contactsList, 'phoneNumber]');
            return User.findAll({where: {phoneNumber: {$in: numberList}}})
        })
        .then( contacts => {
            res.json({contactsList: contacts});
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found');
        })
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



export default router

