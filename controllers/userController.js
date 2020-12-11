const user = require('../models/userSchema');
const userModel = require('../models/user');

class userController{
    constructor(userModel) {
        this.userModel = userModel;
    }

    createUser = async (req, res) => {
        let newuser = new user({
            name: req.body.name,
            password: req.body.password,
            age: req.body.age,
            email: req.body.email,
            gender: req.body.gender,
            photo: req.body.photo,
            likedme: [],
            iliked: [],
            idislike: [],
            matches: [],
        });

        let createdUser = await this.userModel.createNewUser(newuser);
        console.log(createdUser)
        res.redirect('/login');
    };

    updateUser = async (req, res) => {
        //console.log(req.body);
        //console.log(req.session.passport.user);
        
        let updatedUser = await this.userModel.updateOne(req.body, req.session.passport.user);
        res.redirect('/profile')
    };
};

module.exports = userController;