var button = document.querySelector(".header-main__toogle-button");
var menu = document.querySelector(".header-main__navigation")

button.addEventListener("click", ()=> {
    menu.classList.toggle("show");
});
