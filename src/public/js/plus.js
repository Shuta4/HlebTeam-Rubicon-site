'use strict';

const getPopup = document.querySelector(".popup");
const getOpenPopupButton = document.querySelector(".description__add-task");
const getClosePopupButton = document.querySelector(".popup__close");
const getPopupForm = document.querySelector(".popup__form");
const getTasksList = document.querySelector(".tasks");

function togglePopup() {
    getPopup.classList.toggle('popup_opened');
}

function createTask(objectTask) {
    switch(objectTask.type) {
        case "Лёгкая.":
            objectTask.type = "task_white";
            break;
        case "Важная.":
            objectTask.type = "task_red";
            break;
        case "Среднее значение.":
            objectTask.type = "task_indigo";
            break;  
        case "Обычная задача.":
            objectTask.type = "task_grey";
            break;
    }
    getTasksList.insertAdjacentHTML('beforeend', `<article class="tasks__item task ${objectTask.type}">
    <h2 class="task__title">
      ${objectTask.title}
    </h2>
    <p class="task__description">
      ${objectTask.description}
    </p>
    <p class="task__date">
      Истекает: <span class="task__by">${objectTask.date}</span>
    </p>
    <button type="button" class="">Удалить</button>
  </article>`)
}

function submitPopup() {
    event.preventDefault();
    let task = {
        type: document.querySelector(".popup__type").value,
        title: document.querySelector(".popup__title").value,
        description: document.querySelector(".popup__description").value,
        date: document.querySelector(".popup__date").value,
    }
    createTask(task);
    togglePopup();
}

getOpenPopupButton.addEventListener("click", togglePopup);
getClosePopupButton.addEventListener("click", togglePopup);
getPopupForm.addEventListener("submit", submitPopup);
document.addEventListener("keydown", e => {
    if (e.key == "Escape" && document.querySelector(".popup").classList.value != "popup") togglePopup();
})