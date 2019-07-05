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

function createNewUser() {
  let formUsername = document.getElementById('signup-username').value;
  let formEmail = document.getElementById('signup-email').value;
  let formPassword = document.getElementById('signup-password').value;
  let url = "http://localhost:3000/signup";
  let params = "username=" + formUsername + "&email=" + formEmail + "&password=" + formPassword;
  let newUserData = {
    username: formUsername,
    email: formEmail,
    password: formPassword
  }



  // http.onreadystatechange = function() {
  //   if(http.readyState == 4 && http.status == 200) {
  //     console.log('response.text: ', http.responseText);
  //   }
  // }
  // http.onload = function () {
  //   console.log('this: ', this);

  //   // Process our return data
  //   if (http.status >= 200 && http.status < 300) {
  //     // What do when the request is successful
  //     console.log('success!', http);
  //     console.log('response.text: ', http.responseText);
  //   } else {
  //     // What do when the request fails
  //     console.log('The request failed!');
  //   }

  //   // Code that should run regardless of the request status
  //   console.log('This always runs...');
  // };
  // http.open('POST', url, true);
  // http.send(params);
  // console.log('response.text fuck: ', http.responseText);


  fetch(url, {
    method: 'POST',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
        // "Access-Control-Origin": "*"
    },
    body: JSON.stringify(newUserData),
  })
  .then(res => res.json())
  .then(response => console.log('Success: ', response))
  .catch(error => console.error('Error: ', error));


  // postRequest('/api/users', newUserData)
  // .then(data => console.log(data)) // Result from the `response.json()` call
  // .catch(error => console.error(error))
  // const xhr = new XMLHttpRequest();

  // xhr.onload = function() {
  //   // if(xhr.readyState == 4 && xhr.status == 200) {
  //     console.log(this.responseText);
  //   // }
  // }

  // xhr.open('POST', '/api/users');
  // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  // xhr.send(params);

  closeSignupModal();

  // setSessionStorage('loggedIn', 'true');
  // isLoggedIn(true);
}

function postRequest(url, data) {
  return fetch(url, {
    credentials: 'include', // 'include', default: 'omit'
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
  })
  .then(response => response.json())
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
  removeSessionStorage('loggedIn');
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
  if(loggedIn || sessionStorage.loggedIn) {
    signupDiv.classList.add('hide');
    loginDiv.classList.add('hide');
    logoutDiv.classList.remove('hide');
  } else {
    console.log('is NOT logged in');
    signupDiv.classList.remove('hide');
    loginDiv.classList.remove('hide');
    logoutDiv.classList.add('hide');
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

// getMovies();

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

getUsers();
