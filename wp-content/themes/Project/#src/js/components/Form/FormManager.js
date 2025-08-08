class FormManager {
    constructor() {
        this.forms = document.querySelectorAll("form");
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            switch (form.getAttribute("data-form")) {
                case "auth":
                    new UserAuthForm(form);
                    break;
                case "search":
                    new SearchFilterForm(form);
                    break;
                default:
                    new FormController(form);
                    break;
            }
        });
    }
}