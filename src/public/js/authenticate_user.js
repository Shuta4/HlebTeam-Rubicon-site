const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");
const messageBoxClass = ".message_box";

var register_handler = function(event) {
	event.preventDefault();
	form = registerForm;
	if (form.username.value == "") form.querySelector(messageBoxClass).innerText = "Введите имя пользователя!";
	else if (form.email.value == "") form.querySelector(messageBoxClass).innerText = "Введите электронную почту!"; 
	else if (form.password.value == "") form.querySelector(messageBoxClass).innerText = "Введите пароль!";
	else if (form.confirm_password.value == "") form.querySelector(messageBoxClass).innerText = "Подтвердите пароль!";
	else if (form.password.value != form.confirm_password.value) form.querySelector(messageBoxClass).innerText = "Пароль и его подтверждение не совпадают!";
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
	    body: JSON.stringify(new_user)
  	}).then((res)=> res.json()).then((res) => {
  		if (res.ok) {
  			form.querySelector(messageBoxClass).innerText = "Успешная регистрация, перезагрузите страницу!"
  		} else {
  			switch (res.error) {
  				case "ERRVALIDATEUSER": 
  					form.querySelector(messageBoxClass).innerText = "Ошибка ввода! (Пароль должен содержать от 6 до 100 символов латинского алфавита, почта должны быть настоящей.)"
  					break
  				case "ERRDBCONNECTION":
  					form.querySelector(messageBoxClass).innerText = "Ошибка сервера! Повторите попытку позже." 
  					break
  				case "USEREXIST": 
  					form.querySelector(messageBoxClass).innerText = "Пользователь с такими почтой и/или именем уже существует!"
  					break
  				case "UNKNOWNERROR": 
  					form.querySelector(messageBoxClass).innerText = "Неизвестная ошибка! Попробуйте позже или обратитесь к поддержке"
  					break 
  			}
  		}
  	});
}
var login_handler = function(event) {
	event.preventDefault();
	form = loginForm;
	if (form.username.value == "") form.querySelector(messageBoxClass).innerText = "Введите имя пользователя!";
	else if (form.password.value == "") form.querySelector(messageBoxClass).innerText = "Введите пароль!";
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
	    body: JSON.stringify(user)
  	}).then((res)=> res.json()).then((res) => {
  		if (res.ok) {
  			form.querySelector(messageBoxClass).innerText = "Успешный вход, перезагрузите страницу!"
  		} else {
  			switch (res.error) {
  				case "ERRDBCONNECTION":
  					form.querySelector(messageBoxClass).innerText = "Ошибка сервера! Повторите попытку позже." 
  					break
  				case "USERNOTEXIST": 
  					form.querySelector(messageBoxClass).innerText = "Пользователь с такими почтой или именем не существует!"
  					break
  				case "UNKNOWNERROR": 
  					form.querySelector(messageBoxClass).innerText = "Неизвестная ошибка! Попробуйте позже или обратитесь к поддержке"
  					break
  				case "ERRINCORRECTPASSWORD":
  					form.querySelector(messageBoxClass).innerText = "Неправильный пароль!"
  					break 
  			}
  		}
  	});
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
