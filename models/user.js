const user = require('./userSchema');

class userModel {

    async createNewUser(newuser) {
        return user.create(newuser)
        .catch(function(err) {
            if (err.name == 'ValidationError') {
                //console.error('Error Validating!', err.name + err.message);
                return 'Error Validating!' + err.message;
            } else {
                console.error(err);
                return err;
            }
        })
    };

    async returnOne(email) {
        //console.log(email);
        return user.findOne({email: email}).exec();
    };

    async returnOnebyID(id) {
        //console.log(email);
        return user.findById(id).exec();
    };

    async updateOne(updateuser, id) {
        return user.findByIdAndUpdate(id, updateuser)
    };

    async deleteUserByID(id) {
        return user.findByIdAndDelete(id)
    };

    async getAllUsers() {
        return user.find({}, '_id').exec();
    };

    async getLikedUsers(id) {
        return user.findById(id, 'iliked').exec()
    };

    async like(id, userId) {
        return user.findByIdAndUpdate(userId, {$push: {iliked: id}});
    };

    async getliked(id, userId) {
        return user.findByIdAndUpdate(id, {$push: {likedme: userId}});
    };

    async matched(id, userId) {
        await user.findByIdAndUpdate(id, {$push: {matches: userId}});
        return user.findByIdAndUpdate(userId, {$push: {matches: id}});
    };

    async dislike(id, userId) {
        return user.findByIdAndUpdate(userId, {$push: {idisliked: id}});
    };

    async getDislikedUsers(id) {
        return user.findById(id, 'idisliked').exec()
    };

    async unmatchUser(id, userId) {
        return user.findByIdAndUpdate(userId, {$pull: {matches: id}});
    };
}

module.exports = userModel;