const express = require("express")
const session = require('express-session')
const passport = require('passport')
require("./auth")

const app = express();

app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize())
app.use(passport.session())

function isLoggedIn(req, res, next){
    req.user? next() : res.sendStatus(401)
}

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with google</a>')
})

app.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile'],failureRedirect: "'/auth/failed'"}))

app.get('/google/callback', passport.authenticate('google', {successRedirect: '/protected', failureRedirect: '/auth/failed'}))

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
})

app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.get('/auth/failed', (req, res) => {
    res.send("failed to authenticate.")
})

app.listen(5000, () => console.log("listening on 5000."))