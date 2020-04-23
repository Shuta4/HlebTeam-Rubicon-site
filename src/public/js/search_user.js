form = document.querySelector(".search_user_form");
container = document.querySelector(".search_result_container");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	fetch("/api/user/search/" + form.username.value, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    }
  	}).then((res)=> res.json()).then((res) => {
  		if (res.ok) {
  			container.innerHTML = "";
  			res.result.forEach((el) => {
          if (el.name || el.surname) name = (el.name + " " el.surname + " ("+ el.username +")").trim();
          else name = el.username;
  				container.insertAdjacentHTML("beforeend", `                
            <li class="content__results__item user-preview">
              <img alt="Аватар" class="user-preview__avatar" src="https://image.flaticon.com/icons/png/512/64/64572.png">  
              <div class="user-preview__wrapper">
                  <h3 class="user-preview__name">${name}</h3>
                  <ul class="user-preview__statistics">
                      <li class="user-preview__statistics__item">Работы: <b>0</b></li>
                      <li class="user-preview__statistics__item">Подписчики: <b>0</b></li>
                      <li class="user-preview__statistics__item">Подписки: <b>0</b></li>
                  </ul>                       
              </div>
              <ul class="user-preview__buttons">
                  <li class="user-preview__buttons__item">
                      <button class="user-preview__buttons__item__button button button_subscribe">Подписаться</button>                           
                  </li>
                  <li class="user-preview__buttons__item">
                      <button class="user-preview__buttons__item__button button button_contact">Связаться</button>                           
                  </li>
                  <li class="user-preview__buttons__item">
                      <button class="user-preview__buttons__item__button button button_report">Пожаловаться</button>                           
                  </li>                        
              </ul>
            </li>`)

  			})
  		} else {
  			console.log("Search failed!");
  		}
  	});
});