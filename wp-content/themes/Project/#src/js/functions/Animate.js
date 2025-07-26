// LettersAnimation
let title = document.querySelectorAll('._letter-animation');
if (title) {
    for (let index = 0; index < title.length; index++) {
        let el = title[index];
        let txt = el.innerHTML;
        let txt_words = txt.replace('  ', ' ').split(' ');
        let new_title = '';
        for (let index = 0; index < txt_words.length; index++) {
            let txt_word = txt_words[index];
            let len = txt_word.length;
            new_title = new_title + '<p>';
            for (let index = 0; index < len; index++) {
                let it = txt_word.substr(index, 1);
                if (it == ' ') {
                    it = '&nbsp;';
                }
                new_title = new_title + '<span>' + it + '</span>';
            }
            el.innerHTML = new_title;
            new_title = new_title + '&nbsp;</p>';
        }
    }
}



// === Animate ===
function animate({ timing, draw, duration }) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);

        draw(progress); // отрисовать её

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}
function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}
function makeEaseInOut(timing) {
    return function (timeFraction) {
        if (timeFraction < .5)
            return timing(2 * timeFraction) / 2;
        else
            return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
}
function quad(timeFraction) {
    return Math.pow(timeFraction, 2)
}
function circ(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
}
/*
animate({
    duration: 1000,
    timing: makeEaseOut(quad),
    draw(progress) {
        window.scroll(0, start_position + 400 * progress);
    }
});*/