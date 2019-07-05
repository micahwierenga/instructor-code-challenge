const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.js');
const favoriteMoviesController = require('../controllers/favoriteMovies.js');

function authenticatedUser(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

// User Routes

// index
router.get('/api/users', usersController.index);

// create
router.post('/api/users', usersController.create);

// show
router.get('/api/users/:id', usersController.show);

// update
router.put('/api/users/:id', usersController.update);

// destroy
router.delete('/api/users/:id', usersController.destroy);

router.route('/signup')
	.post(usersController.create)
	.post(usersController.postSignup)

// login
router.route('/loginUser')
	.post(usersController.loginUser)
	.post(usersController.postLogin)
// router.post('/loginUser', usersController.loginUser);


// Resort Routes

// index
router.get('/api/favorites', favoriteMoviesController.index);

// create
router.post('/api/favorites', favoriteMoviesController.create);

// show
router.get('/api/favorites/:id', favoriteMoviesController.show);

// update
router.put('/api/favorites/:id', favoriteMoviesController.update);

// destroy
router.delete('/api/favorites/:id', favoriteMoviesController.destroy);

module.exports = router;