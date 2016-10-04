/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Discord authentication strategy authenticates requests by delegating to
 * Discord using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts a `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`     identifies client to Discord
 *   - `clientSecret` secret used to establish ownership of the client key
 *   - `callbackURL`  URL to which Discord will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new DiscordStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/twitchtv/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://discordapp.com/api/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://discordapp.com/api/oauth2/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'discord';

  // Set Discord's auth header
  this._oauth2.setAuthMethod('Bearer');
  this._oauth2.useAuthorizationHeaderforGET(true);

}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Discord using OAuth.
 *
 * @param {http.IncomingMessage} req
 * @param {object} [options]
 * @access protected
 */
Strategy.prototype.authenticate = function(req, options) {  
  // Call the base class for standard OAuth authentication.
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};


/**
 * Retrieve user profile from Discord.
 * For OAuth2, this requires the identify scope, which will return the object 
 * without an email, and optionally the email scope, which returns the object 
 * with an email.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `username`
 *   - `email`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://discordapp.com/api/users/@me', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'discord' };
      profile.id       = json.id;
      profile.username = json.username;
      profile.email    = json.email;
      
      profile._raw  = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
