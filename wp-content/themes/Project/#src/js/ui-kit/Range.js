// === Range ===
const priceSlider = document.querySelector('.price-filter__slider');
if (priceSlider) {

    let textFrom = priceSlider.getAttribute('data-from');
    let textTo = priceSlider.getAttribute('data-to');

    noUiSlider.create(priceSlider, {
        start: [0, 200000],
        connect: true,
        tooltips: [wNumb({ decimals: 0, prefix: textFrom + ' ' }), wNumb({ decimals: 0, prefix: textTo + ' ' })],
        range: {
            'min': [0],
            'max': [200000]
        }
    });

    /*
    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');
    priceStart.addEventListener('change', setPriceValues);
    priceEnd.addEventListener('change', setPriceValues);
    */

    function setPriceValues() {
        let priceStartValue;
        let priceEndValue;
        if (priceStart.value != '') {
            priceStartValue = priceStart.value;
        }
        if (priceEnd.value != '') {
            priceEndValue = priceEnd.value;
        }
        priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
    }
}