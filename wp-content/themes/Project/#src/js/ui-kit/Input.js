// Активация просмотра пароля
const passwords = document.querySelectorAll(".password");

if (passwords) {
    passwords.forEach(password => {
        const input = password.querySelector("input");
        const iconEye = password.querySelector(".password__icon");

        iconEye.addEventListener('click', function () {
            const img = iconEye.querySelector('img');
            if (input.type === "password") {
                input.type = "text";
                img.src = img.src.replace("eye-open.svg", "eye-close.svg");
            } else {
                input.type = "password";
                img.src = img.src.replace("eye-close.svg", "eye-open.svg");
            }
        });
    })
}


//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
    if (inputs.length > 0) {
        for (let index = 0; index < inputs.length; index++) {
            const input = inputs[index];
            const input_g_value = input.getAttribute('data-value');
            input_placeholder_add(input);
            if (input.value != '' && input.value != input_g_value) {
                input_focus_add(input);
            }
            input.addEventListener('focus', function (e) {
                if (input.value == input_g_value) {
                    input_focus_add(input);
                    input.value = '';
                }
                if (input.getAttribute('data-type') === "pass") {
                    if (input.parentElement.querySelector('._viewpass')) {
                        if (!input.parentElement.querySelector('._viewpass').classList.contains('_active')) {
                            input.setAttribute('type', 'password');
                        }
                    } else {
                        input.setAttribute('type', 'password');
                    }
                }

                if (input.classList.contains('_phone')) {
                    input.classList.add('_mask');
                    Inputmask("+7(999) 999 99 99", {
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onBeforeMask: function (value, opts) {
                            // Удаляем первую цифру "8" при вставке из буфера обмена
                            if (value) {
                                if (value[0] === '8') {
                                    value = value.substring(1);
                                }
                                return value;
                            } else {
                                return;
                            }
                        },
                        onKeyDown: function (event, buffer, caretPos, opts) {
                            // Игнорируем первую цифру "8" при вводе
                            if (event.key === '8' && caretPos.begin <= 3 && caretPos.end <= 3) {
                                event.preventDefault(); // Игнорируем ввод "8" в начале
                            }
                        }
                    }).mask(input);
                }
                if (input.classList.contains('_digital')) {
                    input.classList.add('_mask');
                    Inputmask("9{1,}", {
                        "placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function () {
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);
                }
                form_remove_error(input);
            });
            input.addEventListener('blur', function (e) {
                if (input.value == '') {
                    input.value = input_g_value;
                    input_focus_remove(input);
                    if (input.classList.contains('_mask')) {
                        input_clear_mask(input, input_g_value);
                    }
                    if (input.getAttribute('data-type') === "pass") {
                        input.setAttribute('type', 'text');
                    }
                }
            });
            if (input.classList.contains('_date')) {
                const calendarItem = datepicker(input, {
                    customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
                    customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                    overlayButton: 'Применить',
                    overlayPlaceholder: 'Год (4 цифры)',
                    startDay: 1,
                    formatter: (input, date, instance) => {
                        const value = date.toLocaleDateString()
                        input.value = value
                    },
                    onSelect: function (input, instance, date) {
                        input_focus_add(input.el);
                    }
                });
                const dataFrom = input.getAttribute('data-from');
                const dataTo = input.getAttribute('data-to');
                if (dataFrom) {
                    calendarItem.setMin(new Date(dataFrom));
                }
                if (dataTo) {
                    calendarItem.setMax(new Date(dataTo));
                }
            }
        }
    }
}
function input_placeholder_add(input) {
    const input_g_value = input.getAttribute('data-value');
    if (input.value == '' && input_g_value != '') {
        input.value = input_g_value;
    }
}
function input_focus_add(input) {
    input.classList.add('_focus');
    input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
    input.classList.remove('_focus');
    input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
    input.inputmask.remove();
    input.value = input_g_value;
    input_focus_remove(input);
}




// Валидация имени в форме
document.querySelectorAll("input[name='name']").forEach(function (input) {
    input.addEventListener('keydown', function (e) {
        if (e.key.match(/[0-9]/)) return e.preventDefault();
    });
    input.addEventListener('input', function (e) {
        input.value = input.value.replace(/[0-9]/g, "");
    });
});
