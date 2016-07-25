'use strict';

import models      from '../../models';
import { GENERIC } from '../../utils/errorTypes.js';

let UserCall = models.UserCall;

export default function resolveCalls(req, res, next)  {
    let jwtUserId = 15;

    UserCall.findAll({ where: { UserId: jwtUserId}})
        .then(function (calls) {
            if (!calls) {
                res.err(404, 'User not found!')
            } else {
                req.calls = calls;
                next();
                return null;
            }
        })
        .catch(function (err) {
            console.log(err);
            res.err(500)
        })
};

