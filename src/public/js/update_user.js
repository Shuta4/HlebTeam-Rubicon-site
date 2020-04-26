var form = document.querySelector(".user-form__form");
const messageBoxClass = ".message_box";

fetch("/api/user/get/im").then((res)=> res.json()).then((res) => {
	if (!res.ok) {
		console.log(res.error);
		return;
	}
	var user = JSON.parse(res.result);
	form.username.value = user.username;
	form.email.value = user.email;
	form.name.value = user.name;
	form.surname.value = user.surname;
	form.about.value = user.about;
	form.birthday.value = user.birthday;
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
	var user = {
		username: form.username.value,
		email: form.email.value,
		name: form.name.value,
		surname: form.surname.value,
		about: form.about.value,
		birthday: form.birthday.value
	}
	fetch("/api/user/update/im", {
	    method: 'PUT',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(user)
  	}).then(res => res.json()).then(res => {
		if (!res.ok) {
			switch (res.error) {
				case "ERRNOTLOGGEDIN":
					form.querySelector(messageBoxClass).innerHTML = "Требуется войти в аккаунт";
					window.location.href = "/userpage/im";
					break
				case "ERRDBCONNECTION":
					form.querySelector(messageBoxClass).innerHTML = "Ошибка доступа к базе данных";
					break
				default:
					form.querySelector(messageBoxClass).innerHTML = "Неизвестная ошибка";
			}
			return
		}
		window.location.href = "/userpage/im";
	});
})