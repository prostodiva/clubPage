const Association = require("../../database/model/associationModel");
const Club = require("../../database/model/clubModel");
const User = require("../../database/model/userModel");
const { NotFoundError, UnauthorizedError } = require("../errors/errors");

async function ensureOwnership(clubId, userId) {
    const user = await User.findById(userId).exec();
    const club = await Club.findById(clubId).exec();

    if (!user || !club) {
        throw new NotFoundError('User or Club is not found')
    }

    if(user.role === "Admin"){
        return "Admin"
    }

    const association = await Association.findOne({
        clubId: clubId,
        userId: userId
    }).exec()


    if (!association) {
        throw new UnauthorizedError("Club ownership rejected")
    }

    return association.role;
}


module.exports = { ensureOwnership };