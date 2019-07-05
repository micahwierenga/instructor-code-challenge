const db = require('../models');
const FavoriteMovie = db.models.FavoriteMovie;

function index(req, res) {
	console.log('Yippee index');
	FavoriteMovie.findAll()
	    .then(function(favoriteMovies) {
	    	res.json(favoriteMovies);
	    });
};

function show(req, res) {
	console.log('Yippee show');
	FavoriteMovie.findById(req.params.id)
	    .then(function(favoriteMovie) {
	    	console.log(favoriteMovie);
	    	res.json(favoriteMovie);
	    });
};

function create(req, res) {
	console.log('Yippee create favorite');
	console.log('req.body: ', req.body);
	FavoriteMovie.create(req.body)
	    .then(function(newFavoriteMovie) {
	    	console.log(newFavoriteMovie);
	    	res.json(newFavoriteMovie);
	    });
};

function update(req, res) {
	console.log('Yippee update');
	FavoriteMovie.findById(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.updateAttributes(req.body);
	    })
	    .then(function(favoriteMovie) {
	    	res.json(favoriteMovie);
	    });
};

function destroy(req, res) {
	console.log("here is the req.params.id" + req.params.id);
	console.log('Yippee destroy');
	FavoriteMovie.findById(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.destroy();
	    })
	    .then(function() {
	    	res.redirect('/index');
	    });
}

module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;