// app configurations

var env = process.env.NODE_ENV;
var config = module.exports = {};

if(env === 'production') { throw new Error('add production config'); }
else if(env === 'test') { throw new Error('add test config'); }
else {

  config.facebook = {
    version: '2.5',
    appid: '1673422019591664',
    appsecret: '202f3ea65798338ca4ec98baa197f9a4',
    scope: 'user_photos',
    redirect_uri: 'http://localhost:3000/auth/facebook'
  };

  // mongodb - data and session
  config.db = {
    data: 'mongodb://localhost:27017/capsulati-data',
    session: 'mongodb://localhost:27017/capsulati-session'
  };

  // cookies
  config.cookie = {
    name: 'capsulati',
    secret: '1BuO;XZ*)d65QaO91}(un5R=t7Cr31',
    maxAge: 86400 * 1000, // 1 day
    resave: false,
    saveUninitialized: false
  };
}
