'use strict';

import models      from '../../models';
import { GENERIC } from '../../utils/errorTypes.js';

let User = models.User;

export default function resolveUser(req, res, next)  {
    let jwtUserId = req.user.id;

    User.findById(jwtUserId)
        .then(function (loggedInUser) {
            req.user = loggedInUser;
            return next();
        })
        .catch(function (err) {
            res.err(500)
        })
};

