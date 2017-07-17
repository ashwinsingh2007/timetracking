var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    path = require('path'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./configuration/config'),
    apicall = require('./routes/APIroutes'),
    mysql = require('mysql'),
    app = express();
    db = require('./models/database');

require('./configuration/passport')(passport);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'peopleGroove', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api', apicall);
app.get('/', function(req, res) {
    var UserId = '1358801057566550';
    var Permission='user';
    //var query = 'select permission from userinfo where userid = $1';
    //var array_data = [UserId];
    //Permission=result[0].permission;

    res.cookie('UserId', JSON.stringify(UserId));
    res.cookie('Permission', JSON.stringify(Permission));
    res.sendFile(path.join(__dirname, './views', 'index.html'));
});

app.get('/account', ensureAuthenticated, function(req, res) {
    var UserId = req.user.id;
    var Permission='';
    var query = 'select permission from userinfo where userid = $1';
    var array_data = [UserId];
    db.getData(query, array_data, function(result) {
        Permission=result[0].permission;
        res.cookie('UserId', JSON.stringify(UserId));
        res.cookie('Permission', JSON.stringify(Permission));
        res.sendFile(path.join(__dirname, './views', 'index.html'));
    });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/account', failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

app.listen(process.env.PORT || 3000, function() {
    console.log("Server Running......");
    //1358801057566550
})
