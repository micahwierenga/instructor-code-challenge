let signupButton = document.getElementById('signup-btn');
signupButton.addEventListener('click', openSignupModal);

let signupClose = document.getElementById('signup-close');
signupClose.addEventListener('click', closeSignupModal);

let signupCancel = document.getElementById('signup-cancel');
signupCancel.addEventListener('click', closeSignupModal);

function openSignupModal() {
  let signupModal = document.getElementById('signup-modal');
  signupModal.classList.add('is-active');
}

function closeSignupModal() {
  let signupModal = document.getElementById('signup-modal');
  signupModal.classList.remove('is-active');
}

let loginButton = document.getElementById('login-btn');
loginButton.addEventListener('click', openLoginModal);

let loginClose = document.getElementById('login-close');
loginClose.addEventListener('click', closeLoginModal);

let loginCancel = document.getElementById('login-cancel');
loginCancel.addEventListener('click', closeLoginModal);

function openLoginModal() {
  let loginModal = document.getElementById('login-modal');
  loginModal.classList.add('is-active');
}

function closeLoginModal() {
  let loginModal = document.getElementById('login-modal');
  loginModal.classList.remove('is-active');
}

function loginUser() {
  let formEmail = document.getElementById('login-form-email').value;
  let formPassword = document.getElementById('login-form-password').value;
  let http = new XMLHttpRequest();
  let url = "/loginUser";
  let params = "email=" + formEmail + "&password=" + formPassword;
  console.log('params: ', params);
  http.open('POST', url, true);

  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      alert(http.responseText);
    }
  }

  http.send(params);

  setSessionStorage('loggedIn', 'true');
  isLoggedIn(true);
}

function logout() {
  removeSessionStorage('user_id');
  isLoggedIn(false);
}

function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}

function isLoggedIn(loggedIn) {
  let signupDiv = document.getElementById('signup-div');
  let loginDiv = document.getElementById('login-div');
  let logoutDiv = document.getElementById('logout-div');
  let usernameDiv = document.getElementById('username-div');
  if(loggedIn || sessionStorage.user_id) {
    signupDiv.classList.add('hide');
    loginDiv.classList.add('hide');
    logoutDiv.classList.remove('hide');
    usernameDiv.classList.remove('hide');
    if(sessionStorage.user_id) {
      setUserName(sessionStorage.user_id);
    }
  } else {
    console.log('is NOT logged in');
    signupDiv.classList.remove('hide');
    loginDiv.classList.remove('hide');
    logoutDiv.classList.add('hide');
    usernameDiv.classList.add('hide');
  }
}

isLoggedIn();

function getMovies() {
  let http = new XMLHttpRequest();
  let url = encodeURIComponent("http://www.omdbapi.com/?");
  let params = encodeURIComponent("apikey=68a131f1&t=star wars");
  console.log('params: ', params);
  http.open('GET', url + params);

  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      console.log(http.responseText);
    }
  }

  http.send();
}

let movieSearchButton = document.getElementById('movie-search-button');
movieSearchButton.addEventListener('click', function(event) {
  event.preventDefault();
  let title = encodeURIComponent(document.getElementById('movie-search-input').value);
  console.log('title: ', title);
  fetch('/api/searchMovies/?title=' + title)
  .then(res => res.json())
  .then(response => {
    console.log('Success movie: ', response);
    let movieList = '';
    for(let i = 0; i < response.length; i++) {
      let odd = (i % 2 == 0) ? '' : ' movie-result-item-odd';
      movieList += '<p class="movie-result-item' + odd + '">' + response[i].Title + '</p>';
    }
    document.getElementById('movie-results-list').innerHTML = movieList;
  })
  .catch(error => console.error('Error: ', error));
});

// getMovies();

function createFavoriteMovie() {
  let formMovieId = 'tt0120338';
  let formUserId = 1;
  let url = "/api/favorites";
  // let params = "user_id=" + formUserId + "&favorite_movie_id=" + formMovieId;
  let newFavoriteMovieData = {
    favorite_movie_id: formMovieId,
    user_id: formUserId
  }
  fetch(url, {
    method: 'POST',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
        // "Access-Control-Origin": "*"
    },
    body: JSON.stringify(newFavoriteMovieData),
  })
  .then(res => res.json())
  .then(response => console.log('Success: ', response))
  .catch(error => console.error('Error: ', error));
}

let signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();
  let formUsername = document.getElementById('signup-username').value;
  let formEmail = document.getElementById('signup-email').value;
  let formPassword = document.getElementById('signup-password').value;
  let url = "/api/users";
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
    setUserName(response.user.id)
    isLoggedIn(true)
  })
  .catch(error => console.error('Error: ', error));

  closeSignupModal();
});

function setUserName(id) {
  let user_id = sessionStorage.user_id ? sessionStorage.user_id : id;
  if(user_id) {
    fetch('/api/users/' + user_id)
    .then(res => res.json())
    .then(response => {
      document.getElementById('username-display').innerHTML = response.username;
    })
    .catch(error => console.error('Error: ', error));
  }
}

function getUsers() {
  // const xhr = new XMLHttpRequest();

  // xhr.onload = function() {
  //   if(xhr.readyState == 4 && xhr.status == 200) {
  //     console.log(this.responseText);
  //   }
  // }

  // xhr.open('get', '/api/users');
  // xhr.send();
  fetch('/api/users')
  .then(res => res.json())
  .then(response => console.log('Success: ', response))
  .catch(error => console.error('Error: ', error));
}

// getUsers();
