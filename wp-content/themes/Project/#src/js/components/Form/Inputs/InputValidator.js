class InputValidator {
    static validate(input) {
        const name = input.name;
        const value = input.value.trim();

        // Проверка на обязательность
        if (input.dataset.required !== undefined && !value) {
            return { isValid: false, message: 'Поле обязательно для заполнения' };
        }

        switch (name) {
            case 'name':
                return this.validateName(value);
            case 'telephone':
                return this.validatePhone(value);
            case 'email':
                return this.validateEmail(value);
            case 'password':
                return this.validatePassword(value);
            case 'age':
                return this.validateNumber(value, 18, 99);
            case 'textarea':
                return this.validateTextarea(value);
            default:
                return { isValid: true };
        }
    }

    static validateName(value) {
        if (!/^[а-яА-ЯёЁ\s\-]{2,}$/u.test(value)) {
            return { isValid: false, message: 'Имя должно содержать только буквы' };
        }
        return { isValid: true };
    }

    static validatePhone(value) {
        const clean = value.replace(/\D/g, '');
        if (clean.length < 11) {
            return { isValid: false, message: 'Введите корректный номер телефона' };
        }
        return { isValid: true };
    }

    static validateEmail(value) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Некорректный email' };
        }
        return { isValid: true };
    }

    static validateNumber(value, min = null, max = null) {
        const number = parseInt(value, 10);
        if (isNaN(number)) {
            return { isValid: false, message: 'Введите число' };
        }
        if (min !== null && number < min) {
            return { isValid: false, message: `Минимум — ${min}` };
        }
        if (max !== null && number > max) {
            return { isValid: false, message: `Максимум — ${max}` };
        }
        return { isValid: true };
    }

    static validateTextarea(value) {
        if (value.length < 10) {
            return { isValid: false, message: 'Введите не менее 10 символов' };
        }
        return { isValid: true };
    }

    static validatePassword(value) {
        if (value.length < 6) {
            return { isValid: false, message: 'Пароль минимум 6 символов' };
        }
        return { isValid: true };
    }
}
