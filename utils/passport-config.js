const passportLocal = require('passport-local'),
    LocalStrategy = (passportLocal.Strategy),
    bcrypt = require('bcrypt'),
    User = require('../schemas/userSchema.js');

module.exports = function passportInit(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'},
            async (email, password, done) => {
                const user = await User.findOne({email});
                console.log(user)
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
    );
    
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            console.log(err)
        }
    });
}