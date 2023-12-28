require('dotenv').config()
const router = require('express').Router()
const passport = require('passport')
const mailHelper = require('../utils/mailHelper')
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    console.log(req.user == undefined)
    res.render('login', {user: false, message: ""})
})

router.post('/', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}));

router.post('/forgot', async (req,res) => {
    console.log(req.body.email);
    const reqUser = await User.findOne({email: req.body.email})
    console.log(reqUser)
    if (!reqUser) {
        return res.send("Please enter an email Id that is registered");
    }
    var link = process.env.DOMAIN + 'login/forgot/' + reqUser.id
    console.log(link)
    await mailHelper.sendMail(req.body.email, "Password change", "Go to this link to change your password: "+link)
    return res.send("An email has been sent to your account, please check your inbox and click on the link there.");
})

router.get('/forgot/:id', async (req,res) => {
    res.render('fPass', {error: "", user: await User.findById(req.params.id)})
})

router.post('/forgot/:id', async (req,res) => {
    const id = req.params.id
    if (!req.body.newPassword) {
        return res.render('fPass', {error: "Please enter a password", user: await User.findById(id)})
    }
    console.log(req.body.newPassword)
    const newPassword = await bcrypt.hash(req.body.newPassword, 10)
    console.log(newPassword)
    await User.findByIdAndUpdate(id, {
        $set: {
            password: newPassword
        }
    })
    res.redirect('/login')
})

module.exports = router