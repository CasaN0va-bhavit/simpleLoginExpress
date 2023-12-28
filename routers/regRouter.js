require('dotenv').config()
const router = require('express').Router()
const User = require('../schemas/userSchema.js')
const bcrypt = require('bcrypt')
const sendMail = require('../utils/mailHelper.js')
const nodemailer = require('nodemailer');
const ejs = require('ejs')


router.get('/', (req, res) => {
    res.render('register', {error: "", success: false})
})

router.post('/', async (req, res) => {
    const {email, fname, lname, password, cnfpassword} = req.body
    const foundUser = await User.findOne({email})
    if (!email || !password || !fname || !lname || !cnfpassword) {
        return res.render('register', {error: 'Please enter all the credentials', success: false})
    }
    if (password !== cnfpassword) {
        return res.render('register', {error: 'The passwords do not match!', success: false})
    }
    if (foundUser) return res.render('register', {error: "A user already exists with this email.", success: false})
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        email: email,
        fname: fname,
        lname: lname,
        password: hashedPassword
    })
    await newUser.save()
    console.log(`ACCOUNT CREATED`)
    res.render('register', {error: "", success: true})
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router