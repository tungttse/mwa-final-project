const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const fs = require('fs')
const bcrypt = require('bcrypt');
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB_CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

const usersRouter = require('./api/userRouters');
const authRouter = require('./api/authRouters');
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
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
})

// app.post('/login', (req, res) => {
//     let pass = req.body.password
//     let email = req.body.email

//     req.db.findOne({ email: email })
//         .then(rs => {
//             if (rs) {
//                 bcrypt.compare(pass, rs.password, function (err, result) {
//                     if (result == true) {
//                         let token = jwt.sign({
//                             email: req.body.email,
//                             password: rs.password
//                         }, private_key)
//                         res.json({ token: token })
//                     } else {
//                         res.json({error: 'invalid user'})
//                     }
//                 });
//             } else {
//                 res.json({error: 'invalid user'})
//             }
//         })
// })

// app.post('/signup', (req, res) => {
//     let pass = req.body.password
//     let email = req.body.email

//     bcrypt.hash(pass, saltRounds, function (err, hash) {
//         req.db.insertOne({ email: email, password: hash })
//             .then(rs => {
//                 console.log(rs.insertedCount)
//                 let token = jwt.sign({
//                     email: email,
//                     password: hash
//                 }, private_key)
//                 res.json({ token: token })
//             })
//     });
// })

// app.post('/checkemail', (req, res) => {    let email = req.body.email
//     req.db.findOne({ email: email })
//         .then( result => {
//             if(result) {
//                 res.json({isValid : false});
//             } else {
//                 res.json({isValid : true});
//             }
//         })
// })

// app.get('/protected', (req, res) => {
//     res.json({ data: 'this is protected content from server' })
// })

// routers
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use('/*', (req, res) => {
    res.json({ data: 'no data' })
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.message);
});

app.listen(process.env.PORT, _ => console.log(`listening on ${process.env.PORT}...`))