'use strict'

import twilio     from 'twilio';

import { config }         from '../utils';
import { log, LOG_TYPES } from './log';

let twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);

export default function sendSMS(toNumber, message) {
    return new Promise(function (resolve, reject) {

        // Twilio costs us money, so if we're just developing let's not send anything!
        if (process.env.NODE_ENV !== 'production') {
            log(`Pretending to send SMS '${message}' to ${toNumber}`)
            return resolve('ok!!!');
        }

        twilioClient.messages.create(
            {
               to   : `+${toNumber}`,
               from : config.twilio.twilioNumber,
               body : message
            }, function (error, message) {

                if (error) {
                    return reject(error);
                } else {
                    resolve(message);
                }

            }
        )
    })
}

