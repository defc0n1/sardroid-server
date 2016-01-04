'use strict'

import jwt from 'jsonwebtoken';
import { config } from '../utils';

export default function verifyJWT(req, res, next)  {
    let token = req.headers['Authorization']

    if (!token) {
        res.status(400).json({error: 'Token is missing'})
        res.end();
    }

    token = token.replace('Bearer: ', '');

    jwt.verify(token, config.jwt_secret, (err, decoded) => {
        console.log(err);
        console.log(decoded);
        if (err) {
            res.status(400).json({error: 'Error: ' + err})
            res.end();
        } else {
            req.user = decoded.user;
            next();
        }
    })
};

