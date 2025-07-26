// === Functions Popups ===
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
    const el = popup_link[index];
    el.addEventListener('click', function (e) {
        if (unlock) {
            let item = el.getAttribute('href').replace('#', '');
            let video = el.getAttribute('data-video');
            popup_open(item, video);
        }
        e.preventDefault();
    })
}
for (let index = 0; index < popups.length; index++) {
    const popup = popups[index];
    popup.addEventListener("click", function (e) {
        if (!e.target.closest('.popup__body')) {
            popup_close(e.target.closest('.popup'));
        }
    });
}

//ActionsOnHash
if (location.hash) {
    const hsh = location.hash.replace('#', '');
    if (document.querySelector('.popup_' + hsh)) {
        popup_open(hsh);
    }
}

function popup_open(item, video = '') {
    let activePopup = document.querySelectorAll('.popup._active');
    if (activePopup.length > 0) {
        popup_close('', false);
    }
    let curent_popup = document.querySelector('.popup_' + item);
    if (curent_popup && unlock) {
        if (video != '' && video != null) {
            let popup_video = document.querySelector('.popup_video');
            popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        }
        if (!document.querySelector('.menu__body._active')) {
            body_lock_add(500);
        }
        curent_popup.classList.add('_active');
        history.pushState('', '', '#' + item);
    }
}
function popup_close(item, bodyUnlock = true) {
    if (unlock) {
        if (!item) {
            for (let index = 0; index < popups.length; index++) {
                const popup = popups[index];
                let video = popup.querySelector('.popup__video');
                if (video) {
                    video.innerHTML = '';
                }
                popup.classList.remove('_active');
            }
        } else {
            let video = item.querySelector('.popup__video');
            if (video) {
                video.innerHTML = '';
            }
            item.classList.remove('_active');
        }
        if (!document.querySelector('.menu__body._active') && bodyUnlock) {
            body_lock_remove(500);
        }
        history.pushState('', '', window.location.href.split('#')[0]);
    }
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
    for (let index = 0; index < popup_close_icon.length; index++) {
        const el = popup_close_icon[index];
        el.addEventListener('click', function () {
            popup_close(el.closest('.popup'));
        })
    }
}
document.addEventListener('keydown', function (e) {
    if (e.code === 'Escape') {
        popup_close();
    }
});