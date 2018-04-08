const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_r1M0a1n5f';
const APP_SECRET = '5f3c0978f37f47f0a7a0b4c6179ca6e6';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
// let username = "pesho"
// let password = "p"

function loginUser() {
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username: username, password: password}
    }).then(function (res) {
        console.log(res);
        signInUser(res, 'Login successful');
    }).catch(handleAjaxError)
}

function registerUser() {
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        signInUser(res, 'Registration successful.')
    }).catch(handleAjaxError)
}


function createAd() {
    let title = $('#formCreateAd input[name=title]').val();
    let publisher = sessionStorage.getItem('username');
    console.log(publisher);
    let description = $('#formCreateAd textarea[name=description]').val();
    let price = Number($('#formCreateAd input[name=price]').val());
    let date = $('#formCreateAd input[name=datePublished]').val();
    let image = $('#formCreateAd input[name=image]').val();
    let views = Number($('#formCreateAd #create-view').text());
    // let views = null;
    console.log(views);
    console.log(Number(views));

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads',
        data: {title, description, date, price, publisher, image},
        // data: {title, description, date, price, publisher, image, views},
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        listAds();
        showInfo('Advertisement added.')
    }).catch(handleAjaxError)
}

function listAds() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        showListAdsView();
        displayAds(res);
    }).catch(handleAjaxError)
}

function loadAdForEdit(ad) {
    showEditAdView();
    $('#formEditAd input[name=id]').val(ad._id);
    $('#formEditAd input[name=publisher]').val(sessionStorage.getItem('username'));

    $('#formEditAd input[name=title]').val(ad.title);
    $('#formEditAd textarea[name=description]').val(ad.description);
    $('#formEditAd input[name=datePublished]').val(ad.date);
    $('#formEditAd input[name=price]').val(ad.price);
    $('#formEditAd input[name=image]').val(ad.image);
    $('#formEditAd input[name=views]').val(Number(ad.views));
   let views =  $('#formEditAd input[name=views]').val(Number(ad.views));
    console.log('views: (loadAdForEdit)'+ views)
    console.log(ad)
   // $('#formEditAd input[name=views]').val(ad.views);
}

function editAd() {
    let id = $('#formEditAd input[name=id]').val();
    let publisher = $('#formEditAd input[name=publisher]').val();

    let title = $('#formEditAd input[name=title]').val();
    let description = $('#formEditAd textarea[name=description]').val();
    let date = $('#formEditAd input[name=datePublished]').val();
    let price = $('#formEditAd input[name=price]').val();
    let image = $('#formEditAd input[name=image]').val();
    let views = $('#formEditAd input[name=views]').val();
    console.log('views: ' +views);
     //let views =  $('#formEditAd input[name=views]').val(ad.views);

    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        data: {title, description, date, price, publisher, image},
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        listAds();
        showListAdsView();
        showInfo('Advertisement edited.')
    }).catch(handleAjaxError)
}

function viewAdDetails(ad) {
    showDetailedView();

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + ad._id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        let detailsDiv = $('<div>').append(
            $('<img>').attr('src', res.image),
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(res.title),
            $('<label>').text('Description:'),
            $('<p>').text(res.description),
            $('<label>').text('Publisher:'),
            $('<p>').text(res.publisher),
            $('<label>').text('Date:'),
            $('<p>').text(res.date),
            $('<label>').text('Views:'),
            $('<p>').text(Number(res.views))
            );
        $('#viewDetailsAd').append(detailsDiv);
    }).catch(handleAjaxError)
}

function displayAds(ads) {
    console.log(ads)
    let table = $('#ads > table');
    table.find('tr').each((index, el) => {
        if (index > 0) {
            el.remove();
        }
    });
    for (let i = 0; i < ads.length; i++) {
        let tr = $('<tr>');
        table.append(
            $(tr)
                .append($(`<td>${ads[i].title}</td>'`))
                .append($(`<td>${ads[i].publisher}</td>'`))
                .append($(`<td>${ads[i].description}</td>'`))
                .append($(`<td>${ads[i].price}</td>'`))
                .append($(`<td>${ads[i].date}</td>'`))
            // .append($(`<td>${ads[i].image}</td>'`))
        );

        if (ads[i]._acl.creator === sessionStorage.getItem('userId')) {
            $(tr).append(
                $('<td>')
                    .append($('<a href="#">[Read More]</a>').on('click', function () {
                        viewAdDetails(ads[i])
                    }))
                    .append($('<a href="#">[Edit]</a>').on('click', function () {
                        loadAdForEdit(ads[i])
                    }))
                    .append($('<a href="#">[Delete]</a>').on('click', function () {
                        deleteAd(ads[i])
                    }))
            )
        } else {
            $(tr).append(
                $('<td>')
                    .append($('<a href="#">[Read More]</a>').on('click', function () {
                        viewAdDetails(ads[i])
                    }))
            )
        }
    }
}

function deleteAd(ad) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + ad._id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function () {
        listAds();
        showInfo('Book deleted.');
    }).catch(handleAjaxError)
}

function logoutUser() {
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    showInfo('Logout successful.');
}

function signInUser(res, message) {
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);
    $('#loggedInUser').text("Welcome, " + sessionStorage.getItem('username') + "!");
    showHomeView();
    showHideMenuLinks();
    showInfo(message);
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}