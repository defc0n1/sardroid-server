'use strict'

import gcm      from 'node-gcm';
import config   from './config';

const sender = new gcm.Sender(config.notifications.apiToken);

function sendNotification(contents, tokens) {
    return new Promise(function (resolve, reject) {
        const message = new gcm.Message(contents);

        sender.send(message, { registrationTokens: tokens }, function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(response);
                resolve(response);
            }
        });
    });
};

export { sendNotification };

