var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('auth');
});

router.post('/login', (req, res) => {
    let pass = req.body.password
    let email = req.body.email

    req.usersCollection.findOne({ email: email })
        .then(rs => {
            if (rs) {
                bcrypt.compare(pass, rs.password, function (err, result) {
                    if (result == true) {
                        let token = jwt.sign({
                            email: req.body.email,
                            password: rs.password
                        }, private_key)
                        res.json({ token: token })
                    } else {
                        res.json({error: 'invalid user'})
                    }
                });
            } else {
                res.json({error: 'invalid user'})
            }
        })
})

router.post('/signup', (req, res) => {
    let pass = req.body.password
    let email = req.body.email

    bcrypt.hash(pass, process.env.SALT_ROUND_HASH, function (err, hash) {
        req.usersCollection.insertOne({ email: email, password: hash })
            .then(rs => {
                console.log(rs.insertedCount)
                let token = jwt.sign({
                    email: email,
                    password: hash
                }, private_key)
                res.json({ token: token })
            })
    });
})

router.post('/checkemail', (req, res) => {    let email = req.body.email
    req.usersCollection.findOne({ email: email })
        .then( result => {
            if(result) {
                res.json({isValid : false});
            } else {
                res.json({isValid : true});
            }
        })
})

module.exports = router;
