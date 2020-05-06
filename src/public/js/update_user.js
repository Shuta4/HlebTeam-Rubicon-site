'use strict'
document.addEventListener("DOMContentLoaded", () => {
	var form = document.querySelector(".user-form__form");
	const messageBoxClass = ".message_box";
	fetch("/api/user/get/im").then((res)=> res.json()).then((res) => {
		if (!res.ok) {
			switch (res.error) {
				case "ERRNOTLOGGEDIN":
					form.querySelector(messageBoxClass).innerHTML = "Требуется войти в аккаунт";
					window.location.href = "/userpage/im";
					break
				default:
					form.querySelector(messageBoxClass).innerHTML = "Неизвестная ошибка";
			}
			return;
		}
		var user = JSON.parse(res.result);
		var birthday_arr = user.birthday.split("T")[0].split("-");
		birthday_arr[birthday_arr.length - 1] = parseInt(birthday_arr[birthday_arr.length - 1]) + 1;
		var birthday = birthday_arr.join("-");
		form.username.value = user.username;
		form.email.value = user.email;
		form.name.value = user.name;
		form.surname.value = user.surname;
		form.about.value = user.about;
		form.birthday.value = birthday;
	});
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		if (form.avatar.files[0] != undefined) {
			var avatar = new FormData();
			avatar.append('file', form.avatar.files[0]);	
		}
		else var avatar = null;
		var user = {
			username: form.username.value,
			email: form.email.value,
			name: form.name.value,
			surname: form.surname.value,
			about: form.about.value,
			birthday: form.birthday.value,
			old_password: form.old_password.value,
			new_password: form.new_password.value,
			confirm_password: form.confirm_password.value,
			delete_avatar: form.avatar_delete.checked,
			avatar: avatar
		}
		if (user.new_password != user.confirm_password) {
			form.querySelector(messageBoxClass).innerHTML = "Введенные пароли не совпадают!";
			return;
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
					case "ERRINCORRECTPASSWORD":
						form.querySelector(messageBoxClass).innerHTML = "Неправильный старый пароль";
						break
					case "ERRVALIDATEUSER":
						form.querySelector(messageBoxClass).innerHTML = "Неправильный ввод";
						break
					case "INCORRECTIMAGE":
						form.querySelector(messageBoxClass).innerHTML = "Аватар должен быть в формате .jpg и размером не более 5 МБ";
						break
					default:
						form.querySelector(messageBoxClass).innerHTML = "Неизвестная ошибка";
				}
				return
			}
			window.location.href = "/userpage/im";
		});
	});
});
