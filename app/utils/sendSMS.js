'use strict';

import twilio     from 'twilio';

import { config }         from '../utils';
import { log } from './log';

const twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);

export default function sendSMS(toNumber, message) {
    return new Promise((resolve, reject) => {
        // Twilio costs us money, so if we're just developing let's not send anything!
        if (process.env.NODE_ENV !== 'production') {
            log(`Pretending to send SMS '${message}' to ${toNumber}`);
            resolve('ok!!!');
        } else {
            twilioClient.messages.create(
                {
                    to   : `+${toNumber}`,
                    from : config.twilio.twilioNumber,
                    body : message,
                }, (error, output) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(output);
                }
            }
            );
        }
    });
}

