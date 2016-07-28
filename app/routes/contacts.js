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

        // Then, we find all the registered users that match the numbers that were sent for syncing.
        return User.findAll({
            attributes: ['phoneNumber'] ,
            where: { phoneNumber: { $in: numberList}}
        })
        .then( registeredNumbers => {

            let formattedRegisteredNumbers = _.map(registeredNumbers, 'dataValues.phoneNumber');

            // Finally, we filter the sent contacts list down to those matching registered SoAR users.
            let validContacts = _.filter(params.contactsList, contact => {
                let number = contact.phoneNumber.replace('+', '');
                return _.includes(formattedRegisteredNumbers, number )
            });

            let uniqueContacts = _.uniqBy(validContacts, 'phoneNumber');

            return req.user.update({contactsList: uniqueContacts});
        })
        .then( updatedUser => {
            res.status(200).json(updatedUser.contactsList);
        })
        .catch(err => {
            res.err(500, USER.CONTACTS.SAVE_ERROR, 'Error saving contacts list!');
        })

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Contact list is missing!');
    }
});

router.get('/contacts', verifyJWT, resolveUser,  (req, res, next) => {
        let contactsList  = req.user.contactsList || [];
        const numbersOnly = req.user.getContactsListNumbers();

        return User.findAll({
            attributes: ['phoneNumber', 'lastSeen', 'peerJSId'],
            where: { phoneNumber: { $in: numbersOnly}}
        })
        .then( results => {
            // Add additional property to each contact, stating whether or not they're currently online or not
            let listWithState =  _.map(contactsList, contact => {
                const contactFromDB = _.find(results, { phoneNumber: contact.phoneNumber });

                contact.currentState = _.some(peerJSConnections, { phoneNumber: contact.phoneNumber }) ? contactStates.ONLINE : contactStates.OFFLINE
                contact.lastSeen = contactFromDB.lastSeen;
                contact.peerJSId = contactFromDB.peerJSId;

                return contact;
            });

            let sortedList = _.sortBy(listWithState, contact => {
                return -contact.lastSeen;
            });

            res.json(sortedList);
        })
        .catch (err => {
            // TODO: Correct error type here!
            res.err(500, USER.CONTACTS.FETCH_ERROR, 'Error fetching contacts list!');
        });
});

export default router

