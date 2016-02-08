'use strict';

import bcrypt       from 'bcryptjs';
import express      from 'express';
import jwt          from 'jsonwebtoken';
import randomstring from 'randomstring';
import twilio       from 'twilio';

import models                     from '../models';
import { AUTH, GENERIC }          from '../utils/errorTypes.js';
import { VERIFICATION_TYPES }     from '../utils/verificationTypes.js';
import { config }                 from '../utils';
import { verifyJWT, resolveUser } from '../middleware';

let User                = models.User;
let VerificationRequest = models.VerificationRequest;

let router = express.Router();

let twilioClient = new twilio.RestClient(config.twilio.accountSid, config.twilio.authToken);

router.post('/verification', (req, res, next) => {

    let params = req.body;

    if (params.phoneNumber && params.verificationType) {
        if (params.verificationType !== VERIFICATION_TYPES.RESET_PASSWORD && params.verificationType !== VERIFICATION_TYPES.REGISTER) {
           res.err(400, AUTH.VERIFICATION.INVALID_TYPE, 'Invalid verification request type!');
           return next();
        }

        User.findOne({where: {phoneNumber: params.phoneNumber}}).then((user) => {

            if (user && params.verificationType === VERIFICATION_TYPES.REGISTER) {
                res.err(400, AUTH.VERIFICATION.USER_EXISTS, 'User already exists')
                return next();
            }
            else if (!user && params.verificationType === VERIFICATION_TYPES.RESET_PASSWORD) {
                res.err(404, AUTH.VERIFICATION.USER_NOT_FOUND, 'User not found')
                return next();
            }

            let date = new Date();
            date.setMinutes(date.getMinutes() + 60);

            let verificationCode = randomstring.generate(6);
            VerificationRequest.create({
                phoneNumber:      params.phoneNumber,
                verificationCode: verificationCode,
                expireDate:       date,
                beenUsed:         false
            }).then( (vr) => {
                console.log(verificationCode);
                res.status(201).json({message: 'Verification request created'});
                 //twilioClient.messages.create({
                 //       to   : `+${vr.phoneNumber}`,
                 //       from : config.twilio.twilioNumber,
                 //       body : `Your SoAR verification code is ${verificationCode}`
                 //   }, function(error, message) {
                 //       if (error) {
                 //           console.log(error);
                 //           res.err(500, GENERIC.TWILIO_ERROR, error.message)
                 //       } else {
                 //           res.status(201).json({message: 'Verification request created'});
                 //       }
                 //   });
            });
        })

    }
    else {
        if (!params.phoneNumber)      res.err(400, AUTH.VERIFICATION.NUMBER_MISSING, 'Phone number is required!')
        if (!params.verificationType) res.err(400, AUTH.VERIFICATION.TYPE_MISSING,   'Verification type is required')
    }
});

router.post('/register', (req, res, next) => {
    let params = req.body;

    if (params.verificationCode && params.password) {
        VerificationRequest.findOne({where: {
            verificationCode:  params.verificationCode
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

                return User.create({
                    phoneNumber: vr.phoneNumber,
                    password:    hash
                });

            }).then((user) => {
                delete user.dataValues.password;
                res.json(user);
            }).catch((err) => {
                res.err(500, AUTH.REGISTER.REGISTER_FAILED, err)
            });

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
                delete user.dataValues.contactsList;

                jwt.sign(user.dataValues, config.jwt_secret, {
                    issuer:    user.phoneNumber,
                    expiresIn: '7 days'
                }, token => {

                    user.update({ token: token })
                    .then((user) => {
                        delete user.dataValues.password;
                        delete user.dataValues.contactsList;

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

router.post('/resetpw',  (req, res, next) => {

    let params = req.body;

    if (params.verificationCode && params.password) {
        VerificationRequest.findOne({where: {
            verificationCode:  params.verificationCode
        }}).then(function (vr) {

            if (!vr) {
                res.err(404, AUTH.RESET_PASSWORD.NO_VERIFICATION, 'No verification request found');
                return next();
            }

            let expireDate = new Date(vr.expireDate);

            if (new Date() > expireDate) {
                res.err(400, AUTH.RESET_PASSWORD.VERIFICATION_EXPIRED, 'Verification request has expired')
                return next();
            }

            if(vr.beenUsed === true) {
                res.err(400, AUTH.RESET_PASSWORD.VERIFICATION_USED, 'Verification code has been used')
                return next();
            }

            vr.update({ beenUsed: true }).then( (vr) => {
                return User.findOne({ where: { phoneNumber: vr.phoneNumber }})
            })
            .then(user => {
                if (!user) {
                    res.err(500, AUTH.RESET_PASSWORD.USER_NOT_FOUND, 'User not found!');
                }

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(params.password, salt);

                return user.update({password: hash});
            })
            .then( user => {
                delete user.dataValues.password;
                delete user.dataValues.contactsList;
                res.status(200).json(user);
            })
            .catch((err) => {
                res.err(500, AUTH.RESET_PASSWORD.RESET_FAILED, err)
            });
        })

    }
    else {
        res.err(400, GENERIC.MISSING_PARAMS, 'Verification code and password are required!');
    }
});

router.delete('/logout', verifyJWT, resolveUser,  (req, res, next) => {
        req.user.update({ token: null })
        .then( results => {
            res.status(200).json({ message: 'Logged out succesfully' })
        })
        .catch(err => {
            res.err(404, AUTH.LOGOUT.USER_NOT_FOUND, 'User not found')
        })
});

export default router

