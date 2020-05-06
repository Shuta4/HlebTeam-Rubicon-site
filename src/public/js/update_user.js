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
		console.log(user.birthday);
		if (user.birthday) {
			var birthday_arr = user.birthday.split("T")[0].split("-");
			var year = birthday_arr[0];
			var month = birthday_arr[1];
			var day = toString(parseInt(birthday_arr[2]) + 1).lenght == 1 ? "0" + toString(parseInt(birthday_arr[2]) + 1) : toString(parseInt(birthday_arr[2]) + 1);
			var birthday = `${day}-${month}-${year}`;
			console.log(birthday)	
		} else var birthday = null;
		form.username.value = user.username;
		form.email.value = user.email;
		form.name.value = user.name;
		form.surname.value = user.surname;
		form.about.value = user.about;
		form.birthday.value = birthday;
	});
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		var user = new FormData();
		user.append("username", form.username.value);
		user.append("email", form.email.value);
		user.append("name", form.name.value);
		user.append("surname", form.surname.value);
		user.append("about", form.about.value);
		user.append("birthday", form.birthday.value);
		user.append("old_password", form.old_password.value);
		user.append("new_password", form.new_password.value);
		user.append("confirm_password", form.confirm_password.value);
		user.append("delete_avatar", form.avatar_delete.checked);
		if (form.avatar.files[0] != undefined) user.append("avatar", form.avatar.files[0]);
		else user.append("avatar", null);
		if (user.new_password != user.confirm_password) {
			form.querySelector(messageBoxClass).innerHTML = "Введенные пароли не совпадают!";
			return;
		}
		fetch("/api/user/update/im", {
		    method: 'PUT',
		    body: user
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
