export function highlightPerson(ID) {
    $("div.cell").each(function () {
        let person = $(this).data("person");
        if (person && person.ID === ID) {
            $(this).addClass("active");
        }
        else {
            $(this).removeClass("active");
        }
    });
}

export function cancelHighlight() {
    $("div.cell").removeClass("active");
}
