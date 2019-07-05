const bcrypt = require('bcryptjs');
const passport = require('passport');
const auth = require('../auth');
const db = require('../models');
const User = db.models.User;

function index(req, res) {
	console.log('Yippee index');
	User.findAll()
	    .then(function(users) {
	    	res.json(users);
	    });
};

function show(req, res) {
	console.log('Yippee show');
	User.findById(req.params.id)
	    .then(function(user) {
	    	console.log(user);
	    	res.json(user);
	    });
};

function create(req, res) {
	console.log('req: ', req.body);
	console.log('Yippee create user');
	console.log('POST auth/signup password', req.body.email);
	bcrypt.genSalt(10, function(err, salt) {
	   bcrypt.hash(req.body.password, salt, function(err, hash) {
	      req.body.password = hash;
	      console.log('hashed', req.body.password);
	      console.log(req.body.password);

	      User.create(req.body)
	         .then(function(user) {
	            if (!user) return error(res, "not saved");
	            console.log("Here are the user.dataValues: " + user);
	            auth.createJWT(user);
	            console.log("Here is the user " + user);
	            // res.setHeader("Access-Control-Allow-Origin", "*");
	            // res.setHeader(
	            //   "Access-Control-Allow-Methods",
	            //   "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
	            // );
	            // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Allow-Origin");
	            res.json({
	               token: auth.createJWT(user),
	               user: user
	            })
	         })
	   });
	});
};

function update(req, res) {
	console.log('Yippee update');
	User.findById(req.params.id)
	    .then(function(user) {
	    	return user.updateAttributes(req.body);
	    })
	    .then(function(user) {
	    	res.json(user);
	    });
};

function destroy(req, res) {
	console.log("here is the req.params.id" + req.params.id);
	console.log('Yippee destroy');
	User.findById(req.params.id)
	    .then(function(user) {
	    	return user.destroy();
	    })
	    .then(function() {
	    	res.redirect('/index');
	    });
}

function loginUser(req, res) {
  User.findOne({
     where: {
        email: req.body.email
     }
  }).then(function(user) {
     let compare = 'user.$modelOptions.instanceMethods.comparePassword'

     if (!user) {
        return res.status(401).send({
           message: 'Invalid email or password.'
        });
     }
     let p1 = user.dataValues.password,
        p2 = req.body.password;

     validPassword = function() {
        console.log('stored from db: ', user.dataValues.password)
        console.log('password from login form: ', req.body.password)
        bcrypt.compare(req.body.password, user.dataValues.password, function(err, isMatch) {
           console.log(isMatch)
           if (isMatch === true) {
              res.send({
                 token: auth.createJWT(user)
              });
            }
            else if (isMatch === false) {
              console.log("invalid passwoooorrrrddd");
              res.send({ message: 'invalid pword'});
            }
           
        });
     };
     validPassword();
  });
}

//Controllers for signing up and loggin in/out
function getSignup(req, res) {
	res.render('signup.ejs', { message: req.flash('signupMessage') });
};

function postSignup(req, res) {
	var signupStrategy = passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash: true
	});
	return signupStrategy(req, res);
};

function getLogin(req, res) {
	res.render('login.ejs', { message: req.flash('loginMessage') });
};

function postLogin(req, res) {
	var loginStrategy = passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash: true
	});
	return loginStrategy(req, res);
};

function getLogout(req, res) {
	req.logout();
	res.redirect('/');
};

function secret(req, res) {
	res.render('secret.ejs', { secretMessage: "Hey" });
	res.send( {secretMessage: "Hey" });

	var secretStrategy = passport.authenticate('local-secret', {
		successRedirect: '/secret',
		failureRedirect: '/',
		failureFlash: true
	});
	return secretStrategy(req, res);
};

module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;
module.exports.loginUser = loginUser;
module.exports.getLogin = getLogin;
module.exports.postLogin = postLogin;
module.exports.getSignup = getSignup;
module.exports.postSignup = postSignup;
module.exports.getLogout = getLogout;
module.exports.secret = secret;