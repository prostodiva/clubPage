const Club = require('../../database/model/clubModel');

async function getAllClubs() {
    const clubs = await Club.find({});

    const savedClubs = clubs.map((club) => ({
        id: club.id,
        name: club.name
    }));

    return savedClubs;
}



module.exports = { getAllClubs };