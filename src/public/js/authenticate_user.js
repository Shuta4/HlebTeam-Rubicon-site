const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

var register_handler = function(event) {
	event.preventDefault();
	form = registerForm;
	if (form.username.value == "") console.log("Can't register because username field is empty!");
	else if (form.email.value == "") console.log("Can't register because email field is empty!"); 
	else if (form.password.value == "") console.log("Can't register because password field is empty!");
	else if (form.confirm_password.value == "") console.log("Can't register because confirm password field is empty!");
	else if (form.password.value != form.confirm_password.value) console.log("Can't register because password and confirm password don't match");
	else register(form);
}
var register = function(form) {
	new_user = {
		username: form.username.value,
		email: form.email.value,
		password: form.password.value,
		password_confirmation: form.confirm_password.value
	}
	fetch("/api/user/register", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(new_user) // body data type must match "Content-Type" header
  	}).then((res)=> res.json()).then((res) => console.log(res));
}
var login_handler = function(event) {
	event.preventDefault();
	form = loginForm;
	if (form.username.value == "") console.log("Can't login because username field is empty!");
	else if (form.password.value == "") console.log("Can't login because password field is empty!");
	else login(form);
}
var login = function(form) {
	user = {
		username: form.username.value,
		password: form.password.value
	}
	fetch("/api/user/login", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(user) // body data type must match "Content-Type" header
  	}).then((res)=> res.json()).then((res) => console.log(res));
}
var formClick_handler = function(event) {
	event.preventDefault();
	if (event.target == registerForm.submit) {
		register_handler(event);
		return	
	}
	if (event.target == loginForm.submit) {
		login_handler(event);
		return	
	}
	form = event.target == registerForm || event.target == loginForm ? event.target 
		: event.target.parentElement == registerForm || event.target.parentElement == loginForm ? event.target.parentElement : null;
	if (form == null) {
		console.log("ERROR form is null!");
		return;
	} 
	if (!form.classList.contains('active')) {
		other_form = form == registerForm ? loginForm : registerForm;
		form.classList.toggle('active');
		other_form.classList.toggle('active');
	}
}
registerForm.addEventListener("submit", register_handler);
registerForm.addEventListener("click", formClick_handler);
loginForm.addEventListener("submit", login_handler);
loginForm.addEventListener("click", formClick_handler);
