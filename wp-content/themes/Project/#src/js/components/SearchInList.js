// === SearchInList ===
function search_in_list(input) {
    let ul = input.parentNode.querySelector('ul')
    let li = ul.querySelectorAll('li');
    let filter = input.value.toUpperCase();

    for (i = 0; i < li.length; i++) {
        let el = li[i];
        let item = el;
        txtValue = item.textContent || item.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    }
}