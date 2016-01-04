'use strict';

import express from 'express';
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';

import models  from '../models';

let User                = models.Soar_user;
let VerificationRequest = models.Soar_verification_request;

let router = express.Router();

router.post('/verification', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber) {

        User.findOne({where: {phoneNumber: params.phoneNumber}}).then((user) => {

            if (user) {
                res.status(400).json({error: 'User already exists'})
                return next();
            }

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
        })

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

            vr.update({beenUsed: true}).then( (vr) => {
                let salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(params.password, salt);

                User.create({
                    phoneNumber: vr.phoneNumber,
                    password:    hash
                }).then((user) => {
                    res.json(user);
                }).catch((err) => {
                    res.status(500).json({error: err});
                });
            })

        })

    } else {
        res.status(400).json({error: 'Missing required parameters'});
    }
});

export default router

