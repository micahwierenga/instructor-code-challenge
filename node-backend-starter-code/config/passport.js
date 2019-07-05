var LocalStrategy = require('passport-local').Strategy;
let db = require('../models');
let User = db.models.User;

module.exports = function(passport) {
	passport.serializeUser(function(user, callback) {
		callback(null, user.id);
	});

	passport.deserializeUser(function(id, callback) {
		User.findById(id, function(err, user) {
			callback(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, callback) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if (err) return callback(err);
			if (user) {
				return callback(null, false, req.flash('signupMessage', 'An account with this email has already been used'))
			} else {
				var newUser = new User();
				newUser.local.email = email;
				newUser.local.password = newUser.encrypt(password);
				newUser.user_name = req.body.user_name;
				newUser.save(function(err) {
					if (err) throw err;
					return callback(null, newUser);
				})
			}
		})
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, callback) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if (err) return callback(err);
			if (!user) {
				return callback(null, false, req.flash('loginMessage', 'No user found with that email'))
			}
			if (!user.validPassword(password)) {
				return callback(null, false, req.flash('loginMessage', 'Sorry, wrong password'))
			}
			return callback(null, user);
		});
	}));

	passport.use('local-story', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, callback) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if (err) return callback(err);
			if (!user) {
				return callback(null, false, req.flash('storyMessage', 'You must sign up to submit a story'))
			}
			return callback(null, user);
		});
	}));
}