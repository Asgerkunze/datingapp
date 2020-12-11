const user = require('../models/userSchema');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user');
const passport = require('passport');
const mongoose = require('mongoose');

class homeController{
    constructor(userModel) { 
        this.userModel = userModel;
    };

    renderLogin = async (req, res) => {
        res.render('login')
    };
    renderSignup = async (req, res) => {
        res.render('signup')
    };
    renderHome = async (req, res) => {
        res.render('home')
    };

    renderProfile = async (req, res) => {
        //console.log(req.session.passport.user);
        let loggedUser = await this.userModel.returnOnebyID(req.session.passport.user);
        //console.log(loggedUser);
        res.render('profile', {user : loggedUser})
    };

    renderProfileUpdate = async (req, res) => {
        res.render('profileUpdate')
        
    };

    renderMatches = async (req, res) => {
        let loggedUser = await this.userModel.returnOnebyID(req.session.passport.user);
        
        let matchesarray = [];

        for (const item of loggedUser.matches) {
            let match = await this.userModel.returnOnebyID(item);
            matchesarray.push(match);
            //console.log(matchesarray);
        }

        res.render('matches', {matches : matchesarray});
        //console.log(matchesarray);
    };

    logOut = async (req, res) => {
        req.logout();
        res.redirect('/home');
    };

    delete = async (req, res) => {
        let deleteUser = await this.userModel.deleteUserByID(req.session.passport.user);
        req.logout();
        res.redirect('/home');
    };

    showMatches = async (req, res) => {
        let allUsers = await this.userModel.getAllUsers();
        let likedUsers = await this.userModel.getLikedUsers(req.session.passport.user);
        let dislikedUsers = await this.userModel.getDislikedUsers(req.session.passport.user);
        //console.log(likedUsers.iliked);
        //console.log(allUsers);
        
        const mapped = allUsers.map(x => x._id);
        //console.log(mapped)

        let likeableUsersMID = mapped.filter(val => !dislikedUsers.idisliked.includes(val));

        let likeableUsers = likeableUsersMID.find(val => !likedUsers.iliked.includes(val));
        let likeableUser = await this.userModel.returnOnebyID(likeableUsers);

        //console.log(likeableUser);

        if (likeableUser == null) {
            res.redirect('/profile');
        } else if (likeableUser._id == req.session.passport.user) {
            let likemyself = await this.userModel.like(req.session.passport.user,req.session.passport.user);
            res.redirect('/swipe')
        } 
            else {
            res.render("swipe", {match : likeableUser})
        }   
    }; 

    likeUser = async (req, res) => {

        let likedusers = await this.userModel.like(req.params.id, req.session.passport.user);
        let likedby = await this.userModel.getliked(req.params.id, req.session.passport.user);

        let comparearray = likedby.iliked;

        if (comparearray.includes(req.session.passport.user) == true) {
            console.log("MATCH")
            await this.userModel.matched(req.params.id, req.session.passport.user);
            res.redirect('/swipe/matched/' + req.params.id)
        } else {
            res.redirect('/swipe');
        }
    };

    dislikeUser = async (req, res) => {
        await this.userModel.dislike(req.params.id, req.session.passport.user);
        res.redirect('/swipe');
    };

    matched = async (req, res) => {
        let matchNotif = await this.userModel.returnOnebyID(req.params.id);
        //console.log(matchNotif);
        res.render("swipeMatched", {match : matchNotif});
    };

    unmatch = async (req, res) => {
        await this.userModel.unmatchUser(req.params.id, req.session.passport.user);
        res.redirect('/matches')
    };

    initialize(passport, returnOne) {
        const AuthenticateUser = async (email, password, done) => {
            const user = await this.userModel.returnOne(email);
            //console.log(user);
            if (user == null) {
                return done(null, false, {message: "email doesn't exist. Create one"})
            } else {
                if (password==user.password) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Incorrect password"})
                    
                }
             } 
        };
        passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, AuthenticateUser));
        passport.serializeUser((user, done) => done(null, user._id));
        passport.deserializeUser((email, done) => {
            return done(null, this.userModel.returnOne(email))
        });
    };
    noVerify(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/profile')
        }
        next()
    };
    verify(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    };

}


module.exports = homeController;