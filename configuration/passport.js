var FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    db = require('../models/database');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    passport.use(new FacebookStrategy({
            clientID: config.facebook_api_key,
            clientSecret: config.facebook_api_secret,
            callbackURL: config.callback_url
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                try {
                    var query = "select * from userinfo where userid = $1";
                    const data = { userid: profile.id };
                    var array_data = [data.userid];
                    db.getData(query, array_data, function(result) {
                        // console.log(result);
                        if (result.length > 0) {
                            //console.log(result[0].userid);

                            profile.permission = result[0].permission.trim();
                            //(profile);
                        } else {
                            var query = 'insert into userinfo values ($2,$3,$1,$4)';
                            const data = { userid: profile.id, username: profile.displayName, usertoken: accessToken };
                            var array_data = [data.userid, data.username, data.usertoken, 'user'];
                            try {
                                db.insertData(query, array_data, function(result) {
                                    //console.log(result);
                                });
                            } catch (ex) {
                                console.log(ex);
                            }
                        }
                    });
                } catch (ex) {
                    console.log(ex);
                }
                return done(null, profile);
            });
        }));
}