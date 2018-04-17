function attachEvents() {
    $('#btnLoadTowns').on('click', function () {
        loadTowns()
    });

    function loadTowns() {
        let towns = $('#towns').val()
            .split(/,\s/)
            .map(x => x.trim())
            .filter(x => x !== '');

        let source = $('#towns-template').html();
        let template = Handlebars.compile(source);
        console.log(towns);

        let townsArr = [];
        for (let town of towns) {
            let currentTown = {town: town};
            townsArr.push(currentTown);
        }
        let contextObj = {towns: townsArr};
        let html = template(contextObj);

        $('#root').empty();
        $('#root').append(html);
    }
}