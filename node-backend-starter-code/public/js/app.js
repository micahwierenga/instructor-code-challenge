// Handle opening and closing of modals
let closeModalButtons = document.getElementsByClassName('close-modal-button');
for(let i = 0; i < closeModalButtons.length; i++) {
  closeModalButtons[i].addEventListener('click', function(event) {
    let modal = this.closest('.modal');
    modal.classList.remove('is-active');
  })
}

let openModalButtons = document.getElementsByClassName('open-modal-button');
for(let i = 0; i < openModalButtons.length; i++) {
  openModalButtons[i].addEventListener('click', function(event) {
    let modalType = this.getAttribute('data-modal-type');
    document.getElementById(modalType).classList.add('is-active');
  })
}

function closeModal(modalId) {
  let modal = document.getElementById(modalId);
  modal.classList.remove('is-active');
}

function openModal(modalId) {
  let modal = document.getElementById(modalId);
  modal.classList.add('is-active');
}

// Signup
let signupSubmitButton = document.getElementById('signup-submit');
signupSubmitButton.addEventListener('click', function(event) {
  event.preventDefault();
  let formUsername = document.getElementById('signup-username').value;
  let formEmail = document.getElementById('signup-email').value;
  let formPassword = document.getElementById('signup-password').value;
  let url = "/api/users/";
  let newUserData = {
    username: formUsername,
    email: formEmail,
    password: formPassword
  }
  fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUserData),
  })
  .then(res => res.json())
  .then(response => {
    setSessionStorage('user_id', response.user.id)
    setSessionStorage('token', response.token)
    setUserName(response.user.id)
    handleLoginAndLogout()
  })
  .catch(error => console.error('Error: ', error));

  closeModal('signup-modal');
});

// Login
let loginSubmitButton = document.getElementById('login-submit');
loginSubmitButton.addEventListener('click', function(event) {
  event.preventDefault();
  let formEmail = document.getElementById('login-email').value;
  let formPassword = document.getElementById('login-password').value;
  let url = "/loginUser/";
  let loginUserData = {
    email: formEmail,
    password: formPassword
  }
  fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginUserData),
  })
  .then(res => res.json())
  .then(response => {
    if(response['message']) {
      document.getElementById('invalid-login-message').innerHTML = response['message'];
      document.getElementById('login-password').classList.add('is-danger');
    } else {
      setSessionStorage('user_id', response.user.id)
      setSessionStorage('token', response.token)
      setUserName(response.user.id)
      handleLoginAndLogout()
      closeModal('login-modal');
    }
  })
  .catch(error => {
    console.error('Error: ', error)
  });
});

// Logout
let logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', function(event) {
  event.preventDefault();
  sessionStorage.clear();
  handleLoginAndLogout();
})

// Handle session storage
function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}

// Check if user is logged in based on session storage
function isLoggedIn() {
  return (sessionStorage && sessionStorage.user_id) ? true : false;
}

// Handle elements/actions based on logged in status
function handleLoginAndLogout() {
  let signupDiv = document.getElementById('signup-div');
  let loginDiv = document.getElementById('login-div');
  let logoutDiv = document.getElementById('logout-div');
  let usernameDiv = document.getElementById('username-div');
  let loggedIn = isLoggedIn();
  if(loggedIn) {
    signupDiv.classList.add('hide');
    loginDiv.classList.add('hide');
    logoutDiv.classList.remove('hide');
    usernameDiv.classList.remove('hide');
    if(sessionStorage.user_id) {
      setUserName(sessionStorage.user_id);
    }
  } else {
    signupDiv.classList.remove('hide');
    loginDiv.classList.remove('hide');
    logoutDiv.classList.add('hide');
    usernameDiv.classList.add('hide');
    setUserName();
  }
}

handleLoginAndLogout();

// Set username in upper-right corner if user is logged in
function setUserName(id) {
  let user_id = sessionStorage.user_id ? sessionStorage.user_id : id;
  if(user_id) {
    fetch('/api/users/' + user_id)
    .then(res => res.json())
    .then(response => {
      document.getElementById('username-display').innerHTML = response.username;
    })
    .catch(error => console.error('Error: ', error));
  } else {
    document.getElementById('username-display').innerHTML = '';
  }
}

// Movie search by title
let movieSearchButton = document.getElementById('movie-search-button');
movieSearchButton.addEventListener('click', function(event) {
  event.preventDefault();
  let title = encodeURIComponent(document.getElementById('movie-search-input').value);
  fetch('/api/searchMovies/?title=' + title)
  .then(res => res.json())
  .then(response => {
    if(response['message']) {
      document.getElementById('movie-results-list').innerHTML = '<p id="movie-results-no-results" class="has-text-danger">' + response['message'] + '</p>';
    } else {
      prepareMovieList(response);
    }
  })
  .catch(error => console.error('Error: ', error));

  document.getElementById('movie-search-input').value = '';
});

// Create movie list from movie search
function prepareMovieList(movies) {
  let movieList = '<h2 id="movie-result-header">Results</h2>';
  for(let i = 0; i < movies.length; i++) {
    let odd = (i % 2 == 0) ? '' : ' movie-result-item-odd';
    movieList += '<p class="movie-result-item' + odd + '"><span class="movie-results-title">' + movies[i].Title + '</span><a class="button is-success details-button open-modal-button" data-movie-id="' + movies[i].imdbID + '" data-modal-type="movie-details-modal">Details</a></p>';
  }
  document.getElementById('movie-results-list').innerHTML = movieList;

  // Movie details button functionality
  let detailsButton = document.getElementsByClassName('details-button');
  for(let i = 0; i < detailsButton.length; i++) {
    detailsButton[i].addEventListener('click', function(event) {
      let movieId = this.getAttribute('data-movie-id');
      fetch('/api/searchMovies/' + movieId)
      .then(res => res.json())
      .then(response => {
        prepareMovieDetails(response);
      })
      .catch(error => console.error('Error: ', error));
      document.getElementById('movie-details-modal').classList.add('is-active');
    })
  }
}

// Get movie details when Details button is clicked
function prepareMovieDetails(movieDetails) {
  let keys = Object.keys(movieDetails);
  for(let i = 0; i < keys.length; i++) {
    let lowerKey = keys[i].toLowerCase();
    let element = document.getElementById('movie-details-' + lowerKey);
    if(element) {
      element.innerHTML = movieDetails[keys[i]];
    }
  }
  document.getElementById('movie-details-image-container').innerHTML = '<img src="' + movieDetails.Poster + '" id="movie-details-image">';
  let ratingsList = '';
  for(let i = 0; i < movieDetails.Ratings.length; i++) {
    ratingsList += '<li>&nbsp;&nbsp;&nbsp;<em>' + movieDetails.Ratings[i].Source + ':</em> ' + movieDetails.Ratings[i].Value + '</li>';
  }
  document.getElementById('movie-details-ratings-list').innerHTML = ratingsList;

  setMovieDetailsButton(movieDetails.imdbID);
}

function createAddToFavoritesListener() {
  let addToFavoritesButton = document.getElementById('add-to-favorites-button');
  addToFavoritesButton.addEventListener('click', function(event) {
    event.preventDefault();
    let loggedIn = isLoggedIn();
    if(!loggedIn) {
      openModal('not-logged-in-modal');
      closeModal('movie-details-modal');
    } else {
      let movie_id = document.getElementById('movie-details-imdbid').innerHTML;
      let user_id = sessionStorage.user_id;
      let url = "/api/favorites/";
      let newFavoriteMovieData = {
        favorite_movie_id: movie_id,
        user_id: user_id
      }

      fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFavoriteMovieData),
      })
      .then(res => res.json())
      .then(response => {
        document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="remove-from-favorites-button" class="button is-danger" data-movie-id="' + response['id'] + '"">Remove From Favorites</button>';
        createRemoveFromFavoritesListener();
      })
      .catch(error => console.error('Error: ', error));
    }
  });
}

function createRemoveFromFavoritesListener(removeFromList) {
  let removeFromFavoritesButton = document.getElementById('remove-from-favorites-button');
  removeFromFavoritesButton.addEventListener('click', function(event) {
    event.preventDefault();
    let id = this.getAttribute('data-movie-id');
    let url = "/api/favorites/";

    fetch(url + id, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(response => {
      document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="add-to-favorites-button" class="button is-success">Add to Favorites</button>';
      createAddToFavoritesListener();
    })
    .catch(error => console.error('Error: ', error));
  });
}

function setMovieDetailsButton(movie_id) {
  let user_id = sessionStorage.user_id ? sessionStorage.user_id : null;
  if(movie_id) {
    fetch('/api/favorites/' + user_id + '/' + movie_id)
    .then(res => res.json())
    .then(response => {
      if(!response['movie']) {
        document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="add-to-favorites-button" class="button is-success">Add to Favorites</button>';
        createAddToFavoritesListener();
      } else {
        document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="remove-from-favorites-button" class="button is-danger" data-movie-id="' + response['movie']['id'] + '"">Remove From Favorites</button>';
        createRemoveFromFavoritesListener();
      }
    })
    .catch(error => console.error('Error: ', error));
  }
};
