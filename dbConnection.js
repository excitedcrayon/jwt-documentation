const mongoose = require('mongoose');
const DB_URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'user_auth';
const CONNECTION = `${DB_URL}/${DB_NAME}`;

const dbConnection = () => {
    mongoose.connect(CONNECTION, {
        useNewUrlParser: true
    });

    if(mongoose.connection){
        console.log(`DB Connection: ${CONNECTION} is successful`);
    }
};

module.exports = { dbConnection };