'use strict';

import _       from 'lodash';
import express from 'express';

import contactStates              from '../utils/contactStates';
import models                     from '../models';
import { USER, GENERIC }          from '../utils/errorTypes';
import { peerJSConnections }      from '../utils/peerJS';
import { verifyJWT, resolveUser } from '../middleware';

const User = models.User;

const router = express.Router();

router.post('/contacts', verifyJWT, resolveUser, (req, res) => {
    const params = req.body;

    if  (params.contactsList) {
        // First, we reduce the sent contacts list to simply the phone numbers.
        const numberList = _.map(params.contactsList, c => {
            c.phoneNumber.replace('+', '');
        });

        // Then, we find all the registered users that match the numbers that were sent for syncing.
        return User.findAll({
            attributes: ['phoneNumber'],
            where: { phoneNumber: { $in: numberList } },
        })
        .then(registeredNumbers => {
            const formattedRegisteredNumbers = _.map(registeredNumbers, 'dataValues.phoneNumber');

            // Finally, we filter the sent contacts list down to those matching registered SoAR users.
            const validContacts = _.filter(params.contactsList, contact => {
                const number = contact.phoneNumber.replace('+', '');
                return _.includes(formattedRegisteredNumbers, number);
            });

            const uniqueContacts = _.uniqBy(validContacts, 'phoneNumber');

            return req.user.update({ contactsList: uniqueContacts });
        })
        .then(updatedUser => {
            res.status(200).json(updatedUser.contactsList);
        })
        .catch(err => {
            console.log(err);
            res.err(500, USER.CONTACTS.SAVE_ERROR, 'Error saving contacts list!');
        });
    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Contact list is missing!');
    }
});

router.get('/contacts', verifyJWT, resolveUser,  (req, res, next) => {
    const contactsList  = req.user.contactsList;

    // Add additional property to each contact, stating whether or not they're currently online or not
    const listWithState =  _.map(contactsList, contact => {
        contact.currentState = _.includes(peerJSConnections, contact.phoneNumber) ? contactStates.ONLINE : contactStates.OFFLINE;
        return contact;
    });

    const sortedList = _.sortBy(listWithState, contact => {
        return contact.currentState === contactStates.OFFLINE;
    });

    res.json(sortedList);
    return next();
});

export default router;

