// === Menu ===
let iconMenu = document.querySelectorAll(".menu-button");
if (iconMenu != null) {
    let delay = 500;
    let menuBody = document.querySelector(".menu__body");
    iconMenu.addEventListener("click", function (e) {
        if (unlock) {
            body_lock(delay);
            iconMenu.classList.toggle("_active");
            menuBody.classList.toggle("_active");
        }
    });
};
function menu_close() {
    let iconMenu = document.querySelector(".icon-menu");
    let menuBody = document.querySelector(".menu__body");
    iconMenu.classList.remove("_active");
    menuBody.classList.remove("_active");
}