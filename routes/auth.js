'use strict';

import express      from 'express';
import bcrypt       from 'bcryptjs';
import jwt          from 'jsonwebtoken';
import randomstring from 'randomstring';

import models            from '../models';
import { config }        from '../utils';
import { AUTH, GENERIC } from '../utils/errorTypes.js';
import { verifyJWT }     from '../middleware';

let User                = models.Soar_user;
let VerificationRequest = models.Soar_verification_request;

let router = express.Router();

router.post('/verification', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber) {

        User.findOne({where: {phoneNumber: params.phoneNumber}}).then((user) => {

            if (user) {
                res.err(400, AUTH.VERIFICATION.USER_EXISTS, 'User already exists')
                return next();
            }

            var date = new Date();
            date.setMinutes(date.getMinutes() + 60);

            VerificationRequest.create({
                phoneNumber:      params.phoneNumber,
                verificationCode: randomstring.generate(6),
                expireDate:       date,
                beenUsed:         false
            }).then( (vr) => {
                res.status(201).json({message: 'Verification request created'});
            });
        })

    }
    else {
        res.err(400, AUTH.VERIFICATION.NUMBER_MISSING,  'Phone number is required!')
    }
});

router.post('/register', (req, res, next) => {
    let params = req.body;

    if (params.verificationCode && params.password) {
        VerificationRequest.findOne({where: {
            verificationCode:  params.verificationCode, 
        }}).then(function (vr) {

            if (!vr) {
                res.err(404, AUTH.REGISTER.NO_VERIFICATION, 'No verification request found');
                return next();
            }

            let expireDate = new Date(vr.expireDate);

            if (new Date() > expireDate) {
                res.err(400, AUTH.REGISTER.VERIFICATION_EXPIRED, 'Verification request has expired')
                return next();
            }

            if(vr.beenUsed === true) {
                res.err(400, AUTH.REGISTER.VERIFICATION_USED, 'Verification code has been used')
                return next();
            }

            vr.update({beenUsed: true}).then( (vr) => {
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(params.password, salt);

                User.create({
                    phoneNumber: vr.phoneNumber,
                    password:    hash
                }).then((user) => {
                    delete user.dataValues.password;
                    res.json(user);
                }).catch((err) => {
                    res.err(500, AUTH.REGISTER.REGISTER_FAILED, err)
                });
            })

        })

    } else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Missing required parameters')
    }
});

router.post('/login', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber && params.password) {
        User.findOne({where: {phoneNumber: params.phoneNumber}}).then((user) => {

            if (!user) {
                res.err(404, AUTH.LOGIN.USER_NOT_FOUND, 'User not found')
                return next();
            }

            bcrypt.compare(params.password, user.password, (err, response) => {

                if (err) {
                    res.err(500, GENERIC.LOGIN.BCRYPT_ERROR, err)
                    return next();
                }

                if (response === false) {
                    res.err(401, AUTH.LOGIN.WRONG_PASSWORD, 'Wrong password!')
                    return next();
                }

                delete user.dataValues.password;
                delete user.dataValues.token;
                jwt.sign(user, config.jwt_secret, {
                    issuer:    user.phoneNumber,
                    expiresIn: '7 days'
                }, token => {

                    user.update({ token: token })
                    .then(() => {
                        delete user.dataValues.password;
                        res.status(200).json({user});
                    })
                    .catch( err => {
                        res.err(500, GENERIC.UNSPECIFIED_ERROR, err)
                    });

                })
            })
        })

    }
    else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Phone number and password are required!' )
    }
});

export default router

