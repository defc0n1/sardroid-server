'use strict'

import gcm    from 'node-gcm';
import _      from 'lodash';
import config from './config';

const sender = new gcm.Sender(config.notifications.apiToken);
const defaultOptions = {
    priority: 'high',
}

function sendNotification(contents, tokens) {
    return new Promise(function (resolve, reject) {
        if (!tokens) {
            return reject();
        }

        const messageWithDefaults = _.defaults(contents, defaultOptions);
        const message = new gcm.Message(messageWithDefaults);

        sender.send(message, { registrationTokens: tokens }, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
};

export { sendNotification };

