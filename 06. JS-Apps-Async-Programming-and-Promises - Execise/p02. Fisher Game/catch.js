function attachEvents(){
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
            method:'GET',
            url: URL + 'biggestCatches',
            headers: AUTH,
        }).then(function (res) {
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

                divCatch.append($('<button class="update">Update</button>').click(currentCatch._id, updateFcn));
                divCatch.append($('<button class="delete">Delete</button>').click(deleteFcn.bind(this, currentCatch._id)));

                divCatches.append(divCatch);
            }

        }).catch(function (err) {
            console.log(err)
        })
    }

    function deleteFcn(catchId) {
        // let div = $(this).parent();
        // let catchId = div[0].attributes[1].value;

        $.ajax({
            method:'DELETE',
            url: URL + 'biggestCatches/'+catchId,
            headers: AUTH,
        }).then(function (res) {
            loadCatches();
            console.log(res)
        }).catch(function (err) {
            console.log(err)
        })
    }

    function updateFcn(catchId){
        // let id = $($(this).parent()).find('data-id')
        // console.log('id' + id);
        // let div = $($(this).parent());
        //
        // let catchId = div[0].attributes[1].value
        // console.log(catchId);


        let angler = $(this).parent().find('.angler').val();
        let weight = Number($(this).parent().find('.weight').val());
        let species = $(this).parent().find('.species').val();
        let location = $(this).parent().find('.location').val();
        let bait = $(this).parent().find('.bait').val();
        let captureTime = Number($(this).parent().find('.captureTime').val());

        console.log(angler);
        console.log(weight);
        console.log(species);
        console.log(location);
        console.log(bait);
        console.log(captureTime);

        let newCatchObj = JSON.stringify({
            "angler": angler,
            "weight": weight,
            "species": species,
            "location": location,
            "bait": bait,
            "captureTime": captureTime});

        // let newCatchObj = JSON.stringify({ 'angler': angler, 'weight': weight, 'species': species, 'location': location, 'bait': bait, 'captureTime': captureTime})

        $.ajax({
            method:'PUT',
            url: URL + 'biggestCatches/'+catchId,
            headers: AUTH,
            data: newCatchObj,
            contentType: 'application/json',
        }).then(function (res) {
            loadCatches();
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

        let newCatchObj = JSON.stringify({
            "angler": angler,
            "weight": weight,
            "species": species,
            "location": location,
            "bait": bait,
            "captureTime": captureTime});

        $.ajax({
            method:'POST',
            url: URL + 'biggestCatches',
            headers: AUTH,
            contentType: 'application/json',
            data: newCatchObj
        }).then(function (res) {
            loadCatches()
            console.log(res)
        }).catch(function (err) {
            console.log(err)
        })
    }
}