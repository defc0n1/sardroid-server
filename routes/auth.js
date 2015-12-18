'use strict';

import express from 'express';
import models  from '../models';

let User                = models.Soar_user;
let VerificationRequest = models.Soar_verification_request;

console.log(User);
console.log(VerificationRequest);

let router = express.Router();

router.post('/verification', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber) {
        var date = new Date();
        date.setMinutes(date.getMinutes() + 60);
        VerificationRequest.create({
            phoneNumber:      params.phoneNumber,
            verificationCode: Math.floor(Math.random()*90000) + 10000,
            expireDate:       date,
            beenUsed:         false
        }).then( (vr) => {
            res.status(201).json({message: 'Vefication request created'});
        });
    }
    else {
        res.status(400).json({error: 'Phone number is required!'});
    }
});

router.post('/register', (req, res, next) => {
    let params = req.body;

    if (params.phoneNumber && params.verificationCode && params.password) {
        VerificationRequest.findOne({where: {
            verificationCode:  params.verificationCode,
            phoneNumber:       params.phoneNumber
        }}).then(function (vr) {

            if (!vr) {
                res.status(404).json({error: 'No verification request found'})
                return next();
            }

            var expireDate = new Date(vr.expireDate);

            if (new Date() > expireDate) {
                res.status(400).json({error: 'Verification request has expired'});
                return next();
            }

            if(vr.beenUsed === true) {
                res.status(400).json({error: 'Verification code has been used'});
                return next();
            }
            res.json(vr);
            vr.update({beenUsed: true}).then( (vr) => {
                res.json(vr);
            })

        })
    } else {
        res.status(400).json({error: 'Missing required parameters'});
    }
});

export default router

