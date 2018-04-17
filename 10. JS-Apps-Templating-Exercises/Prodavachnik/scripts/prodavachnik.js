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
    let description = $('#formCreateAd textarea[name=description]').val();
    let price = Number($('#formCreateAd input[name=price]').val());
    let date = $('#formCreateAd input[name=datePublished]').val();
    let image = $('#formCreateAd input[name=image]').val();
    let views = Number($('#formCreateAd #create-view').text());

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
        // showListAdsView();
        displayAds(res);
    }).catch(handleAjaxError)
}

function loadAdForEdit(id) {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {

        $('#formEditAd input[name=id]').val(res._id);
        $('#formEditAd input[name=publisher]').val(sessionStorage.getItem('username'));

        $('#formEditAd input[name=title]').val(res.title);
        $('#formEditAd textarea[name=description]').val(res.description);
        $('#formEditAd input[name=datePublished]').val(res.date);
        $('#formEditAd input[name=price]').val(res.price);
        $('#formEditAd input[name=image]').val(res.image);
        $('#formEditAd input[name=views]').val(Number(res.views));
        // let views =  $('#formEditAd input[name=views]').val(Number(res.views));
    }).catch(handleAjaxError)
}

function editAd() {
    let id = $(this).parent().parent().attr('data-id');
    let publisher = sessionStorage.getItem('username');
    // let publisher = $('#formEditAd input[name=publisher]').val();
    let title = $('#formEditAd input[name=title]').val();
    let description = $('#formEditAd textarea[name=description]').val();
    let date = $('#formEditAd input[name=datePublished]').val();
    let price = $('#formEditAd input[name=price]').val();
    let image = $('#formEditAd input[name=image]').val();
    let views = $('#formEditAd input[name=views]').val();
    //  //let views =  $('#formEditAd input[name=views]').val(ad.views);

    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        data: {title, description, date, price, publisher, image},
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        listAds();
        showInfo('Advertisement edited.')
    }).catch(handleAjaxError)
}

function viewAdDetails() {
    let id = $(this).parent().parent().attr('data-id');

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {

        let detailsObj = {
            imgLink: res.image,
            title: res.title,
            description: res.description,
            publisher: res.publisher,
            date: res.date,
            views: res.views,
        };

        let html = templates['viewDetails'](detailsObj);
        $('#content').html(html);
    }).catch(handleAjaxError)
}


function deleteAd() {
    let id = $(this).parent().parent().attr('data-id');
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function () {
        listAds();
        showInfo('Ad deleted.');
    }).catch(handleAjaxError)
}

function logoutUser() {
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    showInfo('Logout successful.');
}

function signInUser(res, message) {
    console.log(res)
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