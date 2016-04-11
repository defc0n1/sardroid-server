'use strict';

import express from 'express';
import models  from '../models';
import { verifyJWT } from '../middleware';

let User = models.User;

let router = express.Router();

// Route to check if a user is registered
router.get('/:phoneNumber/exists',  (req, res, next) => {
    let phoneNumber = req.params.phoneNumber.replace(/[+ ]/, '');
    let found = false;

    User.findOne({ where: { phoneNumber: phoneNumber } })
        .then(user => {
            if (user) {
                found = true;
            }

            res.status(200).json({ found: found, phoneNumber: phoneNumber });
        });
});

export default router;

