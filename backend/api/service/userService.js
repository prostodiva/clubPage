const User = require('../../database/model/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequestError, DuplicateUserError, NotFoundError, PasswordValidationError } = require("../../api/errors/errors");

async function register(email, password, name) {
    if (!email || !password) {
        throw new BadRequestError('email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new DuplicateUserError('The user is already registered');
    }

    if (password.length < 6 ) {
        throw new BadRequestError('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email: email,
        password: hashedPassword,
        name: name,
        associations: [],
    });

    await newUser.save();
    return newUser._id;

}

async function login(email, password) {
    if (!email || !password) {
        throw new BadRequestError("email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new PasswordValidationError('Password does not match');
    }

    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

async function getAllUsers() {
    const users = await User.find({});

    const safeUsers = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        associations: user.associations
    }));

return safeUsers;
}



module.exports = { register, login, getAllUsers };