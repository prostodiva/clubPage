const User = require('../../database/model/userModel')

async function register(email, password, name) {

    const newUser = new User({
        email: email,
        password: password,
        name: name,
        associations: [],
    });

    await newUser.save();
    return newUser._id;

}

module.exports = { register };