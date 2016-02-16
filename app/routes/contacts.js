'use strict';

import _       from 'lodash';
import express from 'express';

import contactStates              from '../utils/contactStates';
import models                     from '../models';
import { USER, GENERIC }          from '../utils/errorTypes';
import { connections }            from '../utils/socketIO';
import { peerJSConnections }      from '../utils/peerJS';
import { verifyJWT, resolveUser } from '../middleware';

let User = models.User;

let router = express.Router();

router.post('/contacts', verifyJWT, resolveUser, (req, res, next) => {
    let params = req.body;

    if  (params.contactsList) {

        // First, we reduce the sent contacts list to simply the phone numbers.
        let numberList = _.map(params.contactsList, function (c) {
            return c.phoneNumber.replace('+', '');
        });

        console.log(numberList);
        // Then, we find all the registered users that match the numbers that were sent for syncing.
        return User.findAll({
            attributes: ['phoneNumber'] ,
            where: { phoneNumber: { $in: numberList}}
        })
        .then( registeredNumbers => {

            let formattedRegisteredNumbers = _.map(registeredNumbers, 'dataValues.phoneNumber');

            // Finally, we filter the sent contacts list down to those matching registered SoAR users.
            let validContacts = _.filter(params.contactsList, contact => {
                return _.includes(formattedRegisteredNumbers, contact.phoneNumber.replace('+', ''));
            });

            console.log(validContacts);
            return req.user.update({contactsList: validContacts});
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

        let contactsList  = req.user.contactsList;

        // Add additional property to each contact, stating whether or not they're currently online or not
        let listWithState =  _.map(contactsList, contact => {
                contact.currentState = _.includes(peerJSConnections, contact.phoneNumber) ? contactStates.ONLINE : contactStates.OFFLINE
                return contact;
        });

        let sortedList = _.sortBy(listWithState, contact => {
                return contact.currentState === contactStates.OFFLINE;
        });

        res.json(sortedList);
});

export default router

