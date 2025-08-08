class InitInputEvent {
    constructor(input) {
        switch (input.name) {
            case 'name':
                this.nameEvent(input)
                break
            case 'telephone':
                this.telephoneEvent(input)
                break
        }
    }

    nameEvent(input) {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
        });
    }
    telephoneEvent(input) {
        Inputmask("+7(999) 999 99 99", {
            clearIncomplete: true,
            clearMaskOnLostFocus: true,
            // onBeforeMask: function (value, opts) {
            //     if (value) {
            //         if (value[0] === '8') {
            //             value = value.substring(1);
            //         }
            //         return value;
            //     } else {
            //         return;
            //     }
            // },
            // onKeyDown: function (event, buffer, caretPos, opts) {
            //     if (event.key === '8' && caretPos.begin <= 3 && caretPos.end <= 3) {
            //         event.preventDefault();
            //     }
            // }
        }).mask(input);
    }
}