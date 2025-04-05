const User = require('../../database/model/userModel')
const Association = require('../../database/model/associationModel')
const Notification = require('../../database/model/notificationModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequestError, DuplicateUserError, NotFoundError, PasswordValidationError } = require("../../api/errors/errors");

async function register(email, password, name, role = 'User') {
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
        role: role,
        associations: [],
    });

    await newUser.save();
    return newUser._id;
}

async function login(email, password) {
    // Add debug logging
    console.log('Login attempt:', { email, passwordProvided: !!password });

    if (!email || !password) {
        throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email });

    // Add debug logging
    console.log('User found:', { exists: !!user, email: email });

    if (!user) {
        throw new NotFoundError('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    // Add debug logging
    console.log('Password check:', { matches: passwordMatches });

    if (!passwordMatches) {
        throw new PasswordValidationError('Password does not match');
    }

    // Make sure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

async function findUserById(userId) {
    const user = await User.findById(userId).exec()

    if (!user) {
        throw new NotFoundError('User does not exist');
    }

    return user;
}

async function getAllUsers() {
    return User.find().lean();
}

async function getUserProfileData(userId, targetUserId) {

    let user = await User.findOne({ _id: userId }).exec();
    let targetUser = await User.findOne({ _id: targetUserId}).exec();

    if (!user) {
        throw new NotFoundError('User does not exist');
    }

    if (!targetUser) {
        throw new NotFoundError('User does not exist');
    }

    let userAssociationsPromises = user.associations.map(association => Association.findOne({ _id: association._id }));
    let userAssociations = await Promise.all(userAssociationsPromises);

    userAssociations = userAssociations.map(association => association.clubId.toString())

    let targetUserAssociationsPromises = targetUser.associations.map(associaition => Association.findOne({ _id: associaition._id }));

    let targetUserAssociations = await Promise.all(targetUserAssociationsPromises)

    targetUserAssociations = targetUserAssociations.map(association => association.clubId.toString())

    let commonClubIds = (targetUserAssociations && userAssociations && targetUserAssociations.length > 0 && userAssociations.length > 0)
        ? targetUserAssociations.filter(value => userAssociations.includes(value)) : []

    return {
        userId: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        profileImageUrl: targetUser.profileImageUrl,
        commonClubIds: commonClubIds
    }
}

async function contactRequest(userId, targetUserId) {
    const user = await User.findById(userId).exec();
    const targetUser = await User.findById(targetUserId).exec();

    if (!user) {
        throw new NotFoundError(`User not found with id - ${userId}`);
    }
    if (!targetUser) {
        throw new NotFoundError(`User not found with id - ${targetUserId}`);
    }

    const BASE_URL = process.env.BASE_URL;

    const message = `📩 ${user.name} has requested to get in contact with you.\n\nClick to view their profile: ${BASE_URL}users/${userId}`;

    const notification = new Notification({
        recipient: targetUserId,
        sender: userId,
        message,
        entityType: 'ContactRequest'
    });

    const savedNotification = await notification.save();

    return savedNotification._id;
}



module.exports = { register, login, getUserProfileData, findUserById, contactRequest, getAllUsers };











