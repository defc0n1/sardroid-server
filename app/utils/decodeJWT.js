'use strict'

import jwt from 'jsonwebtoken'
import { config } from '../utils';

export default function decodeJWT(token) {
    return new Promise(function (resolve, reject) {

       jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(decoded)
            }
       });

    });
}

