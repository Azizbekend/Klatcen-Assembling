// Предназначение каждого класса:
// 1. InputValidator — используется для валидации инпутов
// 2. UserAuthForm — используется для работы с формой авторизации и регистрации
// 3. SearchFilterForm — используется для работы с формой поиска
// 4. ContactForm — используется для работы с формой обратной связи
// 5. FormController — используется для наследованиеи и управления формами
// 6. FormManager — используется для инициализации форм


@@include('./Inputs/InitInputEvent.js')

@@include('./Inputs/InputValidator.js')

@@include('UserAuthForm.js')

@@include('SearchFilterForm.js')

@@include('ContactForm.js')

// @@-include('FormController.js')

@@include('FormManager.js')