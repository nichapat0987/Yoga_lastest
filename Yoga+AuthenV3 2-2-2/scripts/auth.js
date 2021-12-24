// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
        setupExercise(user);
        Getcalburned(user);
        Getweight(user);
        GetUsername(user);
        GetEmail(user);
        setupUI(user);
        UpdatedandSaveCal(user);
      } else {
    setupUI();
  }
});

// get user uid
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    //console.log(user.uid);
    const userxid = {
      userid : user.uid
    }
    localStorage.setItem("userid", JSON.stringify(userxid));
  } else {
    // User not logged in or has just logged out.
  }
});

// create new guide
userid = JSON.parse(localStorage.getItem('userid')).userid
//console.log(userid);
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('exercise').doc(userid).collection('round').add({
    daydate: createForm.daydate.value,
    pcalories: Number(createForm.pcalories.value)
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});


// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  var burnedcal = 0;
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      email: signupForm['signup-email'].value,
      username: signupForm['signup-username'].value,
      weight: signupForm['signup-weight'].value,
      burnedcal : burnedcal
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});