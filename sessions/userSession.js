// session/sessionConfig.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const MONGO_URI = 'mongodb://localhost:27017/sessionDB';

const sessionMiddleware = session({
    secret: 'yourSecretKey123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true
    }
});

module.exports = sessionMiddleware;
