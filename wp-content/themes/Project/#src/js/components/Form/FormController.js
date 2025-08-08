class FormController {
    constructor(form, onSuccess) {
        this.onSuccess = onSuccess;

        this.form = form;
        this.inputs = form.querySelectorAll("input, textarea");
        this.policyCheckboxes = form.querySelectorAll('[data-policy]');
        this.submitBtn = form.querySelector("button");
        this.wasSubmitted = false;

        this.initInputsEvent();
        this.initPolicyEvent();
        this.initSubmit();
    }

    initInputsEvent() {
        this.inputs.forEach(input => {
            new InitInputEvent(input)
        });
    }

    initPolicyEvent() {
        this.policyCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.closest(".checkbox").classList.contains('_error')) {
                    checkbox.closest(".checkbox").classList.remove('_error')
                }
            });
        });
    }

    initSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.wasSubmitted = true;

            if (!this.validateForm()) return;

            const formData = new FormData(this.form);
            formData.append('action', this.form.dataset.form || 'default_action');

            try {
                const response = await fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    if (typeof this.onSuccess === 'function') {
                        this.onSuccess(this.form);
                    }
                }
            } catch (e) {
                console.error("Ошибка отправки формы:", e);
            }
        });
    }

    // validateForm() {
    //     let result = [];

    //     this.inputs.forEach(input => {
    //         result.push(this.validateField(input));
    //     });

    //     result.push(this.checkPolicy())

    //     return !result.includes(false);
    // }

    validateForm() {
        const inputResults = [...this.inputs].map(input => this.validateField(input));
        const policyResult = this.checkPolicy();

        return [...inputResults, policyResult].every(result => result === true);
    }

    checkPolicy() {
        this.policyCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest(".checkbox").classList.add('_error')
            }
        });

        return [...this.policyCheckboxes].every(c => c.checked)
    }

    validateField(input) {
        const { isValid, message } = InputValidator.validate(input);

        if (!isValid) {
            this.addError(input, message);
        } else {
            this.removeError(input);
        }
        return isValid;
    }

    addError(input, message) {
        input.closest('.input').classList.add('_error');
        // error.textContent = message;
    }

    removeError(input) {
        input.closest('.input').classList.remove('_error');
    }
}



























// ТЕСТОВЫЕ



// class FormController {
//     constructor(form) {
//         this.form = form;
//         this.type = form.dataset.formType;
//         this.init();
//     }

//     init() {
//         switch (this.type) {
//             case 'auth':
//                 this.initAuthForm();
//                 break;
//             case 'search':
//                 this.initSearchForm();
//                 break;
//             case 'filter':
//                 this.initFilterForm();
//                 break;
//             case 'sort':
//                 this.initSortForm();
//                 break;
//         }
//     }

//     initAuthForm() {
//         this.inputs = this.form.querySelectorAll("input, textarea");
//         this.wasSubmitted = false;

//         this.inputs.forEach(input => {
//             input.addEventListener('input', () => {
//                 if (this.wasSubmitted) {
//                     this.validateField(input);
//                 }
//             });
//         });

//         this.form.addEventListener("submit", async e => {
//             e.preventDefault();
//             this.wasSubmitted = true;

//             const isValid = this.validateForm();
//             if (!isValid) return;

//             const data = new FormData(this.form);
//             data.append("action", this.form.dataset.form || "default_action");

//             try {
//                 const res = await fetch('/wp-admin/admin-ajax.php', {
//                     method: "POST",
//                     body: data
//                 });

//                 if (res.ok) popup_open("message");
//             } catch (err) {
//                 console.error("Ошибка при отправке формы:", err);
//             }
//         });
//     }

//     initSearchForm() {
//         this.form.addEventListener("submit", e => {
//             // просто отправка формы или добавление параметров в URL
//         });
//     }

//     initFilterForm() {
//         this.form.addEventListener("change", e => {
//             // Можно сразу отправлять форму через ajax
//             const data = new FormData(this.form);
//             data.append("action", this.form.dataset.form || "filter_action");

//             fetch('/wp-admin/admin-ajax.php', {
//                 method: "POST",
//                 body: data
//             }).then(res => res.text()).then(html => {
//                 document.querySelector("#filtered-results").innerHTML = html;
//             });
//         });
//     }

//     initSortForm() {
//         this.form.addEventListener("change", e => {
//             const formData = new FormData(this.form);
//             const sortParam = formData.get("sort");

//             const url = new URL(window.location.href);
//             url.searchParams.set("sort", sortParam);
//             window.location.href = url.toString(); // или через ajax
//         });
//     }

//     validateForm() {
//         let isValid = true;
//         this.inputs.forEach(input => {
//             const { isValid: valid } = InputValidator.validate(input);
//             if (!valid) isValid = false;
//         });
//         return isValid;
//     }

//     validateField(input) {
//         const { isValid, message } = InputValidator.validate(input);
//         // тут add/remove error
//     }
// }
