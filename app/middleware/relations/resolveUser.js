'use strict';

import models      from '../../models';

const User = models.User;

export default function resolveUser(req, res, next)  {
    const jwtUserId = req.user.id;

    User.findById(jwtUserId)
        .then(loggedInUser => {
            if (!loggedInUser) {
                res.err(404, 'User not found!');
            } else {
                req.user = loggedInUser;
                next();
                return null;
            }
        })
        .catch(() => {
            res.err(500);
        });
}

