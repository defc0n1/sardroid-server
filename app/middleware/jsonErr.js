'use strict';

import rollbar       from 'rollbar';
import { GENERIC  } from '../utils/errorTypes';

export default function (req, res, next) {

    res.err = function (statusCode = 500, type = GENERIC.UNSPECIFIED_ERROR, message = 'Unspecified error') {
        if (process.env.NODE_ENV === 'production') {
           rollbar.reportMessage(`Error of type ${type} with message ${message} to url ${req.url}`, 'error', req);
        }
       res.status(statusCode).json({
           type    : type,
           message : message
       });
    }

    return next();
}

