function register(form) {
	new_user = {
		login: form.login.value,
		email: form.email.value,
		password: form.password.value,
		password_confirmation: form.confirm_password.value
	}
	fetch("/user", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(new_user) // body data type must match "Content-Type" header
  	}).then((res)=> res.json()).then((res)=> console.log(res));
}
function register_handler(event) {
	event.preventDefault();
	form = event.target;
	if (form.login == "") console.log("Can't register because login field is empty!");
	else if (form.email == "") console.log("Can't register because email field is empty!"); 
	else if (form.password == "") console.log("Can't register because password field is empty!");
	else if (form.confirm_password == "") console.log("Can't register because confirm password field is empty!");
	else if (form.password.value != form.confirm_password.value) console.log("Can't register because password and confirm password don't match");
	else register(form);
}

document.querySelector(".register-popup__form").addEventListener("submit", register_handler);
