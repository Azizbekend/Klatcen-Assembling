// === Select === 
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
    selects_init();
}
function selects_init() {
    for (let index = 0; index < selects.length; index++) {
        const select = selects[index];
        select_init(select);
    }
    //select_callback();
    document.addEventListener('click', function (e) {
        selects_close(e);
    });
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Escape') {
            selects_close(e);
        }
    });
}
function selects_close(e) {
    const selects = document.querySelectorAll('.select');
    if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_body_options = select.querySelector('.select__options');
            select.classList.remove('_active');
            _slideUp(select_body_options, 100);
        }
    }
}
function select_init(select) {
    const select_parent = select.parentElement;
    const select_modifikator = select.getAttribute('class');
    const select_selected_option = select.querySelector('option:checked');
    select.setAttribute('data-default', select_selected_option.value);
    select.style.display = 'none';

    select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

    let new_select = select.parentElement.querySelector('.select');
    new_select.appendChild(select);
    select_item(select);
}
function select_item(select) {
    const select_parent = select.parentElement;
    const select_items = select_parent.querySelector('.select__item');
    const select_options = select.querySelectorAll('option');
    const select_selected_option = select.querySelector('option:checked');
    const select_selected_text = select_selected_option.text;
    const select_type = select.getAttribute('data-type');

    if (select_items) {
        select_items.remove();
    }

    let select_type_content = '';
    if (select_type == 'input') {
        select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
    } else {
        select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
    }

    select_parent.insertAdjacentHTML('beforeend',
        '<div class="select__item">' +
        '<div class="select__title">' + select_type_content + '</div>' +
        '<div hidden class="select__options">' + select_get_options(select_options) + '</div>' +
        '</div></div>');

    select_actions(select, select_parent);
}
function select_actions(original, select) {
    const select_item = select.querySelector('.select__item');
    const selectTitle = select.querySelector('.select__title');
    const select_body_options = select.querySelector('.select__options');
    const select_options = select.querySelectorAll('.select__option');
    const select_type = original.getAttribute('data-type');
    const select_input = select.querySelector('.select__input');

    selectTitle.addEventListener('click', function (e) {
        selectItemActions();
    });

    function selectMultiItems() {
        let selectedOptions = select.querySelectorAll('.select__option');
        let originalOptions = original.querySelectorAll('option');
        let selectedOptionsText = [];
        for (let index = 0; index < selectedOptions.length; index++) {
            const selectedOption = selectedOptions[index];
            originalOptions[index].removeAttribute('selected');
            if (selectedOption.classList.contains('_selected')) {
                const selectOptionText = selectedOption.innerHTML;
                selectedOptionsText.push(selectOptionText);
                originalOptions[index].setAttribute('selected', 'selected');
            }
        }
        select.querySelector('.select__value').innerHTML = '<span>' + selectedOptionsText + '</span>';
    }
    function selectItemActions(type) {
        if (!type) {
            let selects = document.querySelectorAll('.select');
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                if (select != select_item.closest('.select')) {
                    select.classList.remove('_active');
                    _slideUp(select_body_options, 100);
                }
            }
            _slideToggle(select_body_options, 100);
            select.classList.toggle('_active');
        }
    }
    for (let index = 0; index < select_options.length; index++) {
        const select_option = select_options[index];
        const select_option_value = select_option.getAttribute('data-value');
        const select_option_text = select_option.innerHTML;

        if (select_type == 'input') {
            select_input.addEventListener('keyup', select_search);
        } else {
            if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
                select_option.style.display = 'none';
            }
        }
        select_option.addEventListener('click', function () {
            for (let index = 0; index < select_options.length; index++) {
                const el = select_options[index];
                el.style.display = 'block';
            }
            if (select_type == 'input') {
                select_input.value = select_option_text;
                original.value = select_option_value;
            } else {
                if (original.hasAttribute('multiple')) {
                    select_option.classList.toggle('_selected');
                    selectMultiItems();
                } else {
                    select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
                    original.value = select_option_value;
                    select_option.style.display = 'none';
                }
            }
            let type;
            if (original.hasAttribute('multiple')) {
                type = 'multiple';
            }
            selectItemActions(type);
        });
    }
}
function select_get_options(select_options) {
    if (select_options) {
        let select_options_content = '';
        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            const select_option_value = select_option.value;
            if (select_option_value != '') {
                const select_option_text = select_option.innerHTML;
                let select_option_sub = select_option.getAttribute("data-sub");
                if (select_option_sub) { select_option_sub = `<span class="select__option-sub">${select_option_sub}</span>`; } else { select_option_sub = ""; }
                select_options_content = `${select_options_content}<div data-value="${select_option_value}" class="select__option">${select_option_text}${select_option_sub}</div>`;
            }
        }
        return select_options_content;
    }
}
function select_search(e) {
    let select_block = e.target.closest('.select ').querySelector('.select__options');
    let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
    let select_search_text = e.target.value.toUpperCase();

    for (let i = 0; i < select_options.length; i++) {
        let select_option = select_options[i];
        let select_txt_value = select_option.textContent || select_option.innerText;
        if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
            select_option.style.display = "";
        } else {
            select_option.style.display = "none";
        }
    }
}
function selects_update_all() {
    let selects = document.querySelectorAll('select');
    if (selects) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_item(select);
        }
    }
}
