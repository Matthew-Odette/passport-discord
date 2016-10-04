# Passport-Discord

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Discord](https://discordapp.com/) using the OAuth 2.0 API.

This module lets you authenticate using Discord in your Node.js applications.
By plugging into Passport, Discord authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-discord

## Usage

#### Create an Application
Before using `passport-discord`, you must register an application with Discord. 
If you have not already done so, a new application can be created at 
[Discord's Developer Site](https://discordapp.com/developers/applications/me). 
Your application will be issued a Client ID and Client Secret, which need to be 
provided to the strategy. You will also need to configure a callback URL which 
matches the route in your application.

#### Configure Strategy
The Dircord authentication strategy authenticates users using a Dircord
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a Client ID, Client Sectret, and callback URL.

A `scope` is required, all scopes are [available here](https://discordapp.com/developers/docs/topics/oauth2#scopes)

At a miminum, your application must request the `identify` scope for this 
strategy to access the authenticating user's profile.

```javascript
passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/discord/callback",
    scope: ["identify"]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ discordId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'discord'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```


## Credits

  - [John Kernke](http://github.com/johnkernke)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright for portions of Passport-Discord are held by John Kernke, 2014 as part
of Passport-Twitchtv. All other copyright for Passport-Discord are held by 
Matthew Odette, 2016.
