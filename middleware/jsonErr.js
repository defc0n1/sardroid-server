'use strict';

import { GENERIC  } from '../utils/errorTypes';

export default function (req, res, next) {

    res.err = function (statusCode = 500, type = GENERIC.UNSPECIFIED_ERROR, message = 'Unspecified error') {
       res.status(statusCode).json({
           type    : type,
           message : message
       });
    }

    return next();
}

