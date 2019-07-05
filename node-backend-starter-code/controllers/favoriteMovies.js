const request = require('request');
const db = require('../models');
const FavoriteMovie = db.models.FavoriteMovie;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const omdbUrl = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;

function search(req, res) {
	let url = omdbUrl + "&s=" + req.query.title;
	request(url, function(err, response, body) {
		console.log('movies: ', JSON.parse(body).Search);
	    let movies = JSON.parse(body).Search;
	    if(!movies) {
	    	res.json({message: 'No results found'});
	    } else {
	    	res.json(movies);
	    }
	})
}

function searchOne(req, res) {
	let url = omdbUrl + "&i=" + req.params.id;
	request(url, function(err, response, body) {
		console.log('DETAILS: ', JSON.parse(body));
	    res.json(JSON.parse(body));
	})
};

function index(req, res) {
	console.log('Yippee index');
	FavoriteMovie.findAll()
	    .then(function(favoriteMovies) {
	    	res.json(favoriteMovies);
	    });
};

function show(req, res) {
	console.log('Yippee show');
	FavoriteMovie.findByPk(req.params.id)
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
	FavoriteMovie.findByPk(req.params.id)
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
	FavoriteMovie.findByPk(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.destroy();
	    })
	    .then(function() {
	    	res.redirect('/index');
	    });
}

module.exports.search = search;
module.exports.searchOne = searchOne;
module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;