var register_handler = function(event) {
	event.preventDefault();
	form = event.target;
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
	form = event.target;
	if (form.username.value == "") console.log("Can't register because username field is empty!");
	else if (form.password.value == "") console.log("Can't register because password field is empty!");
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
document.querySelector(".register_form").addEventListener("submit", register_handler);
document.querySelector(".login_form").addEventListener("submit", login_handler);

