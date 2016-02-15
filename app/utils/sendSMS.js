'use strict'

import twilio     from 'twilio';

import { config }         from '../utils';
import { log, LOG_TYPES } from './log';

let twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);

export default function sendSMS(toNumber, message) {
    return new Promise(function (resolve, reject) {
        twilioClient.messages.create(
            {
               to   : `+${toNumber}`,
               from : config.twilio.twilioNumber,
               body : message
            }, function (error, message) {
                if (error) reject(error);
                else resolve(message);
            }
        )
    })
}

