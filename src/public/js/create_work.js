var form = document.querySelector(".work-form__form");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	work = {
		title: form.title.value,
		description: form.description.value,
		download_link: form.download_link.value
	}
	fetch("/work/", {
		method: "POST",
		headers: {
	    	'Content-Type': 'application/json'
	    },
		body: JSON.stringify(work);
	}).then(res => res.json()).then(res => {
		if (res.ok) window.location.href = "/userpage/im";
		else switch (res.error) {
			case "ERRNOTLOGGEDIN":
				console.log("You need to log in to access this page!");
				window.location.href = "/userpage/im";
			break
			case "ERRACCESSDENIED":
				console.log("You haven't got permissions to create work!");
			break
			case "ERRDBCONNECTION":
				console.log("Error with db!");
			break
			default:
				console.log("Unknown error!");
			break
		}
	})
})