form = document.querySelector(".search_user_form");
container = document.querySelector(".search_result_container");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	fetch("/api/user/search/" + form.username.value).then((res)=> res.json()).then((res) => {
  		if (res.ok) {
  			container.innerHTML = "";
        var result = JSON.parse(res.result);
  			for (var i = 0; i < result.length; i++) {
          el = result[i]
          if (el.name || el.surname) var name = (el.name + " " + el.surname + " ("+ el.username +")").trim();
          else var name = el.username;
          if (el.avatar) var avatar = "/img/uploads/avatars/" + el.id + ".jpg";
          else var avatar = "/img/profile_no_avatar.png";
  				container.insertAdjacentHTML("beforeend", `                
            <li class="content__results__item user-preview">
              <img alt="Аватар" class="user-preview__avatar" src="${avatar}">  
              <div class="user-preview__wrapper">
                  <h3 class="user-preview__name"><a class="user-preview__name__link" href=${"/userpage/" + el.id}>${name}</a></h3>
                  <ul class="user-preview__statistics">
                      <li class="user-preview__statistics__item">Работы: <b>${el.works_counter}</b></li>
                      <li class="user-preview__statistics__item">Подписчики: <b>${el.followers}</b></li>
                  </ul>                       
              </div>
              <ul class="user-preview__buttons">
                <li class="user-preview__buttons__item">
                    <button class="user-preview__buttons__item__button button button_subscribe">Подписаться</button>                           
                </li>
                <li class="user-preview__buttons__item">
                    <button class="user-preview__buttons__item__button button button_report">Пожаловаться</button>                           
                </li>                        
              </ul>
            </li>`)

  			}

  		} else {
  			console.log("Search failed!");
  		}
  	});
});