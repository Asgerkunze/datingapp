const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const userModel = require('../models/user');
const userController = require('../Controllers/userController');

const controller = new userController(new userModel);

router.post('/signup', controller.createUser);
router.post('/update', controller.updateUser);

module.exports = router;