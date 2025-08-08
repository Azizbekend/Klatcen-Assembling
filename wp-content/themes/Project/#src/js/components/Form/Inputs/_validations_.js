
// === Работа с инпутами и формами ===
if (document.querySelector('form')) {
	const forms = document.querySelectorAll("form");

	forms.forEach(form => {
		const formButton = form.querySelector("button");

		// Добавление обработчиков событий к полям
		const inputs = form.querySelectorAll("input")
		if (inputs) { inputs.forEach(addEventInput) }

		// Добавление обработчиков событий к политикам
		const policyPolitics = form.querySelectorAll("[data-policy]");
		if (policyPolitics) {
			formButton.disabled = true;
			addEventPolicy(policyPolitics, formButton)
		}

		form.addEventListener('submit', async function (e) {
			e.preventDefault();

			if (isValidateInputs(this)) {
				let mailFormData = new FormData(e.target);
				mailFormData.append("action", form.dataset.form || "default_action");

				try {
					let response = await fetch('/wp-admin/admin-ajax.php', {
						method: 'POST',
						body: mailFormData
					});
					if (response.ok) {

						popup_open("message")
						// document.querySelector(".form").remove();
						// document.querySelector(".form__message").classList.add("_active");
					}
				} catch (error) {
					console.error('Ошибка при отправке формы:', error);
				}
			}
		})
	})
}

// Функция для добавления обработчиков событий к политикам
function addEventPolicy(policyCheckboxes, button) {
	let checkAnswers = [];
	policyCheckboxes.forEach(politic => {
		politic.addEventListener('change', function () {
			for (let i = 0; i < policyCheckboxes.length; i++) {
				checkAnswers[i] = policyCheckboxes[i].checked
			}
			button.disabled = checkAnswers.includes(false)
			checkAnswers = [];
		})
	});
}

// Функция для добавления обработчиков событий к инпутам
function addEventInput(input) {
	switch (input.name) {
		case "name":
			input.addEventListener('input', function () {
				this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
			});
			break;
		case "name":
			input.addEventListener('input', function () {
				this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
			});
			break;

		case "file":
			input.addEventListener('change', function () {
				const file = this.files[0];
				if (!file) return;

				const allowedExtensions = /(\.pdf|\.doc|\.docx|\.jpg|\.jpeg|\.png)$/i;
				const maxSize = 5 * 1024 * 1024;

				if (!allowedExtensions.exec(file.name)) {
					this.value = '';
					input.closest('.file').classList.add('_error');
					return;
				}

				if (file.size > maxSize) {
					this.value = '';
					input.closest('.file').classList.add('_error');
					return;
				}
			});
			break;

		// Ввода только цифр
		case "number":
			input.addEventListener('input', function () {
				this.value = this.value.replace(/\D/g, '');

				if (this.value.length > 12) {
					this.value = this.value.slice(0, 12);
					return;
				}
			});
			break;
	}
}
// Функция для валидации инпутов
function isValidateInputs(form) {
	const inputs = form.querySelectorAll("input");
	let isValid = true;
	let isValidBoolean = true;


	inputs.forEach(input => {
		let answer;

		if (!input.disabled) {
			switch (input.type) {
				case "text":
					answer = input.value.length > 0
					answer ? input.classList.remove("_error") : input.classList.add("_error");
					isValidBoolean = answer;
					break;

				case "tel":
					answer = input.value.length > 15 && input.value.length < 19
					answer ? input.classList.remove("_error") : input.classList.add("_error");
					isValidBoolean = answer;
					break;

				case "number":
					isValidBoolean = isValidateInputNumber(input);
					break;

				case "email":
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					answer = emailRegex.test(input.value.trim());

					answer ? input.classList.remove("_error") : input.classList.add("_error");
					isValidBoolean = answer;
					break;

				case "password":
					answer = input.value.length > 6
					answer ? input.classList.remove("_error") : input.classList.add("_error");
					isValidBoolean = answer;
					break;
				case "file":
					answer = input.value.length > 0;
					answer ? input.classList.remove("_error") : input.classList.add("_error");
					isValidBoolean = answer;
					break;
			}
		}


		if (!isValidBoolean) {
			isValid = false;
		}

		if (input.name === "password_repeat") {
			if (input.value !== form.querySelector("[name='password']").value) {
				input.classList.add("_error");
				isValid = false;
			}
		}
	})

	return isValid;
}
// Функция для валидации инпутов number
function isValidateInputNumber(input) {
	switch (input.name) {
		case "inn":
			if (!(input.value.length == 9 || input.value.length == 10 || input.value.length == 12)) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		case "ogrn":
			if (!(input.value.length === 13 || input.value.length === 15)) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		case "okpo":
			if (!(input.value.length === 8 || input.value.length === 10)) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		case "paymentAccount":
			if (input.value.length !== 20) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		case "correspondent":
			if (input.value.length !== 20) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		case "bik":
			if (input.value.length !== 9) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}

		default:
			if (input.value.length === 0) {
				input.classList.add('_error');
				return false;
			} else {
				return true;
			}
	}
}
// === КОНЕЦ ВАЛИДАЦИИ ПОЛЕЙ ===	

