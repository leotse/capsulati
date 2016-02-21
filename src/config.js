// app configurations

var env = process.env.NODE_ENV;
var config = module.exports = {};

if(env === 'production') { throw new Error('add production config'); }
else if(env === 'test') { throw new Error('add test config'); }
else {

  // facebook api settings
  config.facebook = {
    version: '2.5',
    appid: '1673422019591664',
    appsecret: '202f3ea65798338ca4ec98baa197f9a4',
    scope: 'user_photos',
    redirect_uri: 'http://localhost:3000/auth/facebook'
  };

  // instagram api settings
  config.instagram = {
    // new ig client that requires submission approval
    clientid: 'a1f68c637db948869b27547ec62f51f1',
    clientsecret: '4cef45849776423ab723421d8b9de1b5',
    // grandfathered client id that just works
    clientid2: 'ea0ac3c3467542c18deafdf2d7e38669',
    clientsecret2: 'cda054b8dc784d2091f18c7e03d9c199',
    redirect: 'http://localhost:3000/auth/instagram'
  };

  // mongodb - data and session
  config.db = {
    data: 'mongodb://localhost:27117/capsulati-data',
    session: 'mongodb://localhost:27117/capsulati-session'
  };

  // cookies
  config.cookie = {
    name: 'capsulati',
    secret: '1BuO;XZ*)d65QaO91}(un5R=t7Cr31',
    maxAge: 30 * 7 * 24 * 3600 * 1000, // 1 month
    resave: false,
    saveUninitialized: false
  };

  // worker settings
  config.worker = {
    instagram: { timeout: 60 },
    facebook: { timeout: 60 }
  };
}
