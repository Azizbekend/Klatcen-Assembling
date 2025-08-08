class SearchFilterForm {
    init() {
        this.form.addEventListener("change", () => {
            this.onChangeSubmit();
        });
    }
}
