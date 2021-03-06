const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const fs = require('fs');
const UserServices = require('../services/userServices');
const router = express.Router();

const private_key = fs.readFileSync('./keys/private.key');

router.get('/', function(req, res) {
  res.send('auth');
});

router.post('/login', (req, res) => {
    // email as Id
    let email = req.body.email
    let pass = req.body.password
    
    new UserServices(req.usersCollection).findByEmail(email)
        .then(user => {
            bcrypt.compare(pass, user.password , function(err, result) {
                if(result == true) {
                    let token = jwt.sign({
                        email: email 
                    }, private_key)
                    res.json({ token: token, userInfo : 
                        { 
                        email: user._id,
                        first_name: user.first_name, 
                        last_name: user.last_name, 
                        gender: user.gender
                    }
                 })
                } else {
                    res.json({error: 'invalid user'})
                }
            });           
        })
        .catch(_=> res.json({error: 'invalid user'}))
})

router.post('/signup', (req, res) => {
    let pass = req.body.password
    let email = req.body.email
    let fname = req.body.fname
    let lname = req.body.lname
    let dob = req.body.dob
    
    bcrypt.hash(pass, parseInt(process.env.SALT_ROUND_HASH), function (errHash, hash) {
        new UserServices(req.usersCollection).insert(
            {
                _id: email, password: hash,
                first_name: fname, last_name: lname, birth_date: dob
            }
        )
        .then(serviceResp => {
            let token = jwt.sign({
                email: email
            }, private_key)
            res.json({ token: token })
        })
        .catch(err => {
            res.json({ error: err})
        })
    });
})

router.post('/checkemail', (req, res) => {    
    let email = req.body.email
    new UserServices(req.usersCollection).checkEmail(email)
    .then(_ => res.json({isValid : false}))
    .catch(_ =>  res.json({isValid : true}))
})

module.exports = router;
