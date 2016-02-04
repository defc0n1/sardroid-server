'use strict';

import express from 'express';

import models        from '../models';
import { verifyJWT } from '../middleware';

let User = models.User;

let router = express.Router();

export default router

