var form = document.querySelector(".work-form__form");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	var work = new FormData();
	work.append("title", form.title.value);
	user.append("description", form.description.value);
	user.append("download_link", form.download_link.value);
	user.append("delete_preview", form.delete_preview.checked);
	var links = [];
	document.querySelectorAll(".work_link").forEach((el) => {
		title = el.querySelector(".work_link_title").value;
		url = el.querySelector(".work_link_url").value;
		links.push({
			title: title,
			link: url
		});
	});
	user.append("links", links);
	if (form.preview.files[0] != undefined) user.append("preview", form.preview.files[0]);
	else user.append("preview", null);
	if (form.images.files[0] != undefined) user.append("images", form.images.files);
	else user.append("images", null)
	fetch("/api/work/", {
	    method: 'POST',
	    body: work
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
				case "ERRVALIDATEWORK":
					form.querySelector(messageBoxClass).innerHTML = "Неправильный ввод";
					break
				case "INCORRECTIMAGE":
					form.querySelector(messageBoxClass).innerHTML = "Каждая картинка должна быть в формате .jpg и размером не более 5 МБ";
					break
				default:
					form.querySelector(messageBoxClass).innerHTML = "Неизвестная ошибка";
			}
			return
		}
		window.location.href = "/userpage/im";
	});
});
var deleteLink = function(event) {
	event.preventDefault();
	i = event.target.getAttribute("data");
	document.querySelectorAll(".work_link")[i].remove();
}
var createLink = function(event) {
	event.preventDefault();
	i = document.querySelectorAll(".work_link").length;
	document.querySelector(".work_links").insertAdjacentHTML("beforeend", 
		`<div class="work-form__form__links__link work_link">
            <input type="text" name="link_title${i}" value="" class="work-form__form__links__link__title">
            <input type="url" name="link_url${i}" value="" class="work-form__form__links__link__link"> 
            <button type="button" data="${i}" class="work-form__form__links__link work_link_delete">Удалить</button>
        </div>`)
	document.querySelectorAll(".work_link_delete")[i].addEventListener("click", deleteLink);
}
var deleteImage = function(event) {
	event.preventDefault();
	i = event.target.getAttribute("data-i");
	id = event.target.getAttribute("data-id");
	document.querySelectorAll(".work_image")[i].remove();
	fetch("api/img/delete/" + id, {
		method: "DELETE"
	}).then((res) => {
		if (!res.ok) console.log(res.error);
	})
}
document.querySelector(".add_link").addEventListener("click", createLink);
document.querySelectorAll(".delete_image").forEach(el => {
	el.addEventListener("click", deleteImage);
});

document.querySelectorAll(".delete_link").forEach(el => {
	el.addEventListener("click", deleteLink);
});