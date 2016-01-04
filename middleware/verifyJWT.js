'use strict'

import { config, decodeJWT } from '../utils';

export default function verifyJWT(req, res, next)  {
    console.log(req.headers);
    let token = req.headers['authorization']

    if (!token) {
        res.status(400).json({error: 'Token is missing'})
        return;
    }

    token = token.replace('Bearer: ', '');

    decodeJWT(token)
        .then(results => {
            req.user = results;
            next();
        })
        .catch( err => {
            res.status(400).json({error: 'Error: ' + err})
            res.end();
        })
};

