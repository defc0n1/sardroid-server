'use strict';

import express from 'express';
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';

import models  from '../models';
import { config }  from '../utils';

import { verifyJWT } from '../middleware';

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
                res.status(201).json({message: 'Verification request created'});
            }); 
        })

    }
    else {
        res.status(400).json({error: 'Phone number is required!'});
    }
});

router.post('/register', (req, res, next) => {
    let params = req.body;

    if (params.verificationCode && params.password) {
        VerificationRequest.findOne({where: {
            verificationCode:  params.verificationCode, 
        }}).then(function (vr) {

            if (!vr) {
                res.status(404).json({error: 'No verification request found'})
                return next();
            }

            let expireDate = new Date(vr.expireDate);

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
                let hash = bcrypt.hashSync(params.password, salt);

                User.create({
                    phoneNumber: vr.phoneNumber,
                    password:    hash
                }).then((user) => {
                    delete user.password;
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

router.post('/login', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber && params.password) {
        User.findOne({where: {phoneNumber: params.phoneNumber}}).then((user) => {

            if (!user) {
                res.status(404).json({error: 'User not found'})
                return next();
            }

            bcrypt.compare(params.password, user.password, (err, response) => {

                if (err) {
                    res.status(500).json({error: 'Error: ' + err});
                    return next();
                }

                if (response === false) {
                    res.status(401).json({error: 'Wrong password!'});
                    return next();
                }

                delete user.password;
                jwt.sign(user, config.jwt_secret, {
                    issuer:    user.phoneNumber,
                    expiresIn: '7 days'
                }, token => {

                    user.update({ token: token })
                    .then(() => {
                        delete user.password;
                        res.status(200).json({user});
                    })
                    .catch( err => {
                        res.status(500).json({error: 'Error: ' + err});
                    });

                })
            })
        })

    }
    else {
        res.status(400).json({error: 'Phone number and password are required!'});
    }
});

export default router

