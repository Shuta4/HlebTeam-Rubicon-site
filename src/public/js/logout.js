var logout_button = document.querySelector(".logout_button");

logout_button.addEventListener("click", (event)=> {
	event.preventDefault();
	fetch("/api/user/logout", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    }
  	}).then((res)=> res.json()).then((res) => {
  		if (res.ok) {
  			window.location.reload();
  		} else {
  			console.log("Logout failed!");
  		}
  	});
});