if (process.env.NODE_ENV !== 'production') { 
    console.log(`Running in ${process.env.NODE_ENV}`)
    require('dotenv').config(); 
};


const settings = {
    serverPort: process.env.SERVER_PORT,
    serverUUID: process.env.SERVER_UUID,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
};

Object.freeze(settings);

module.exports = settings;

