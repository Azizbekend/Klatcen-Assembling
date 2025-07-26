// ===  Swipers Initializations ===
if (document.querySelector('.selector')) {
    var sliderPartners = new Swiper('.selector', {
        spaceBetween: 16,
        slidesPerView: '1',
        watchOverflow: true,
        pagination: {
            el: '.selector__pagination',
            clickable: true,
            // dynamicBullets: true,
        },
        navigation: {
            nextEl: ".selector__next",
            prevEl: ".selector__prev",
        },
        breakpoints: {
            320: {
                slidesPerView: '1.2',
            },
            600: {
                slidesPerView: '1.3',
            },
            992: {
                slidesPerView: '1.8',
            },
        }
    });
}