const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');

const userModel = require('../models/user');

const homeController = require('../controllers/homeController');

const controller = new homeController(new userModel);

controller.initialize(
    passport,
    email => controller.userModel.returnOne(email),
);
router.get('/logout', controller.logOut);
router.get('/home', controller.noVerify, controller.renderHome);
router.get('/login', controller.noVerify, controller.renderLogin);
router.get('/signup', controller.noVerify, controller.renderSignup);
router.get('/profile', controller.verify, controller.renderProfile);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
}));
router.get('/delete', controller.delete);
router.get('/swipe', controller.verify, controller.showMatches);
router.get('/swipe/like/:id', controller.likeUser);
router.get('/swipe/dislike/:id', controller.dislikeUser);
router.get('/swipe/matched/:id', controller.matched)
router.get('/matches', controller.verify, controller.renderMatches);
router.get('/matches/unmatch/:id', controller.verify, controller.unmatch);


module.exports = router;