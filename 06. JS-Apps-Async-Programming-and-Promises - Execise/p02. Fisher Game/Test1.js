function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_ByNheDdqz/';
    const USERNAME = 'pesho';
    const PASSWORD = 'p';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const AUTH = {'Authorization': 'Basic ' + BASE_64};
    const ContType = {'Content-Type': 'application/json'};

    $('.load').on('click', loadCatches);
    $('.add').on('click', addNewCatch);

    function loadCatches() {
        $.ajax({
            method: 'GET',
            url: URL + 'biggestCatches',
            headers: AUTH,
            // headers: {AUTH,ContType}
        }).then(function (res) {
            console.log('Response')
            console.log(res)
            let divCatches = $('#catches');
            divCatches.empty();
            for (let currentCatch of res) {
                let divCatch = $(`<div class="catch" data-id="${currentCatch._id}">`);
                divCatch.append($(`<label>Angler</label>`));
                divCatch.append($(`<input type="text" class="angler" value="${currentCatch.angler}"/>`));
                divCatch.append($('<label>Weight</label>'));
                divCatch.append($(`<input type="number" class="weight" value="${currentCatch.weight}"/>`));
                divCatch.append($('<label>Species</label>'));
                divCatch.append($(`<input type="text" class="species" value="${currentCatch.species}"/>`));
                divCatch.append($('<label>Location</label>'));
                divCatch.append($(`<input type="text" class="location" value="${currentCatch.location}"/>`));
                divCatch.append($('<label>Bait</label>'));
                divCatch.append($(`<input type="text" class="bait" value="${currentCatch.bait}"/>`));
                divCatch.append($('<label>Capture Time</label>'));
                divCatch.append($(`<input type="number" class="captureTime" value="${currentCatch.captureTime}"/>`));
                divCatch.append($('<button class="update">Update</button>').click(updateFcn.bind(this, currentCatch._id, divCatch)));
                divCatch.append($('<button class="delete">Delete</button>').click(deleteFcn.bind(this, currentCatch._id, divCatch)));

                divCatches.append(divCatch);
            }

        }).catch(function (err) {
            console.log(err)
        })
    }

    function deleteFcn(catchId, divCatch) {
        // let div = $(this).parent();
        // let catchId = div[0].attributes[1].value;

        $.ajax({
            method: 'DELETE',
            url: URL + 'biggestCatches/' + catchId,
            headers: AUTH,
        }).then(function (res) {
            loadCatches()
            console.log(res)
        }).catch(function (err) {
            console.log(err)
        })
    }

    function updateFcn(catchId, divCatch) {
        // console.log('divCatch: ' + JSON.stringify(divCatch))
        // console.log(divCatch)
        // console.log(this)

        // let id = $($(this).parent()).find('data-id')
        // console.log('id' + id);
        // let div = $($(this).parent());

        // let catchId = div[0].attributes[1].value
        console.log(catchId);
        console.log(divCatch);
        console.log('this: ' + this);
        console.log( this);


        let angler = $(divCatch).find('.angler').val();
        let weight = Number($(divCatch).find('.weight').val());
        let species = $(divCatch).find('.species').val();
        let location = $(divCatch).find('.location').val();
        let bait = $(divCatch).find('.bait').val();
        let captureTime = Number($(divCatch).find('.captureTime').val());

        console.log(angler);
        console.log(weight);
        console.log(species);
        console.log(location);
        console.log(bait);
        console.log(captureTime);

        // let newCatchObj = JSON.stringify({
        //     "angler": angler,
        //     "weight": weight,
        //     "species": species,
        //     "location": location,
        //     "bait": bait,
        //     "captureTime": captureTime})
        let newCatchObj = {angler, weight, species, location, bait, captureTime};

        $.ajax({
            method: 'PUT',
            url: URL + 'biggestCatches/' + catchId,
            headers: AUTH,
            data: newCatchObj
        }).then(function (res) {
            loadCatches()
            console.log(res)
        }).catch(function (err) {
            console.log(err)
        })
    }

    function addNewCatch() {
        let angler = $('#addForm .angler').val();
        let weight = Number($('#addForm .weight').val());
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = Number($('#addForm .captureTime').val());

        let newCatchObj = { 'angler': angler, 'weight': weight, 'species': species, 'location': location, 'bait': bait, 'captureTime': captureTime}
        // let newCatchObj = JSON.stringify({ 'angler': angler, 'weight': weight, 'species': species, 'location': location, 'bait': bait, 'captureTime': captureTime})

        console.log(angler);
        console.log(weight);
        console.log(species);
        console.log(location);
        console.log(bait);
        console.log(captureTime);

        // let newCatchObj = JSON.stringify({
        //     "angler": angler,
        //     "weight": weight,
        //     "species": species,
        //     "location": location,
        //     "bait": bait,
        //     "captureTime": captureTime
        // })
        $.ajax({
            method: 'POST',
            url: URL + 'biggestCatches',
            headers: AUTH,
            // headers: {AUTH,ContType},
            data: newCatchObj
        }).then(function (res) {
            loadCatches()
            console.log(res)
        }).catch(function (err) {
            console.log(err)
        })
    }
}