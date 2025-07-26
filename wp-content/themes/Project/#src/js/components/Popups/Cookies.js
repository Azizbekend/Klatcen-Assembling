// === COOKIES ===
document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('cookieKlatcen')) {
        var consentBanner = document.querySelector('.cookies-message');
        consentBanner.style.display = 'flex';
        document.querySelector('.cookies-message__button').addEventListener('click', function () {
            localStorage.setItem('cookieKlatcen', 'accepted');
            consentBanner.style.display = 'none';
        });
    }
});
