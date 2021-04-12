const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const cors = require('cors')
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB_CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

const usersRouter = require('./api/userRouters');
const authRouter = require('./api/authRouters');
const boardRouter = require('./api/boardRouters');
const cardRouter = require('./api/cardRouters');
const columnRouter = require('./api/columnRouters');

const private_key = fs.readFileSync('./keys/private.key');

function _mapDBCollection(req) {
    req.usersCollection = req.db.collection(process.env.DB_COLLECTION_USER)
    req.boardsCollection = req.db.collection(process.env.DB_COLLECTION_BOARD)
}

app.use((req, res, next) => {
    if (!db) {
        client.connect(function (err) {
            req.db = client.db(process.env.DB_NAME);
            _mapDBCollection(req)
            next();
        });
    } else {
        req.db = db;
        _mapDBCollection(req)
        next();
    }
})

// middware
//Accept all cross-domain XHR requests using cors middleware.
app.use(cors())
app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
    const whitelistRoutes = [
        '/api/auth/signup', 
        '/api/auth/login', 
        '/api/auth/checkemail'
    ]
    if (whitelistRoutes.indexOf(req.url) >= 0) {
        return next()
    }
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            jwt.verify(bearerToken, private_key);
            next();
        } catch (e) {
            console.log(e)
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
})

// routers
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/boards', boardRouter);
app.use('/api/cards', cardRouter);
app.use('/api/columns', columnRouter);

app.use('/*', (req, res) => {
    res.json({ data: 'no data' })
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.message);
});

app.listen(process.env.PORT, _ => console.log(`listening on ${process.env.PORT}...`))