const db = require('../models');
const FavoriteMove = db.models.FavoriteMove;

function index(req, res) {
	console.log('Yippee index');
	FavoriteMove.findAll()
	    .then(function(favoriteMovies) {
	    	res.json(favoriteMovies);
	    });
};

function show(req, res) {
	console.log('Yippee show');
	FavoriteMove.findById(req.params.id)
	    .then(function(favoriteMovie) {
	    	console.log(favoriteMovie);
	    	res.json(favoriteMovie);
	    });
};

function create(req, res) {
	console.log('Yippee create favorite');
	FavoriteMove.create(req.body)
	    .then(function(newFavoriteMove) {
	    	console.log(newFavoriteMove);
	    	res.json(newFavoriteMove);
	    });
};

function update(req, res) {
	console.log('Yippee update');
	FavoriteMove.findById(req.params.id)
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
	FavoriteMove.findById(req.params.id)
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