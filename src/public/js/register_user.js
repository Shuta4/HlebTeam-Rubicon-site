var register = function(form) {
	new_user = {
		username: form.login.value,
		email: form.email.value,
		password: form.password.value,
		password_confirmation: form.confirm_password.value
	}
	fetch("/api/user", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(new_user) // body data type must match "Content-Type" header
  	}).then((res)=> res.json()).then((res) => console.log(res));
}
var register_handler = function(event) {
	event.preventDefault();
	form = event.target;
	if (form.login.value == "") console.log("Can't register because login field is empty!");
	else if (form.email.value == "") console.log("Can't register because email field is empty!"); 
	else if (form.password.value == "") console.log("Can't register because password field is empty!");
	else if (form.confirm_password.value == "") console.log("Can't register because confirm password field is empty!");
	else if (form.password.value != form.confirm_password.value) console.log("Can't register because password and confirm password don't match");
	else register(form);
}

document.querySelector(".register-popup__form").addEventListener("submit", register_handler);
