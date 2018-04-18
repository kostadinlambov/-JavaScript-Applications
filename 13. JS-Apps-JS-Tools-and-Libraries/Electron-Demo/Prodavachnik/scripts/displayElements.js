function showView(viewName) {
    $('main > section').hide(); // Hide all views
    $('#' + viewName).show(); // Show the selected view only
}

function showHideMenuLinks() {
    $('#linkHome').show();
    if (sessionStorage.getItem('authToken') === null) { // No logged in user
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
        $('#linkLogout').hide();
        $('#loggedInUser').hide();
    } else { // We have logged in user
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        $('#linkLogout').show();
        $('#loggedInUser').show();
    }
}

function showInfo(message) {
    let infobox = $('#infoBox');
    infobox.text(message);
    infobox.show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 5000)
}

function showError(errMessage) {
    let errorBox = $('#errorBox');
    errorBox.text('Error: ' + errMessage);
    errorBox.show();
}

function showDetailedView() {
    $('#viewDetailsAd').empty();
    showView('viewDetailsAd');
}

function showHomeView() {
    showView('viewHome');
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showLoginView() {
    $('#formLogin').trigger('reset');
    showView('viewLogin');
}

function showListAdsView() {
    showView('viewAds');
}

function showCreateAdView() {
    $('#formCreateAd').trigger('reset');
    showView('viewCreateAd');

}

function showEditAdView() {
    $('#formEditAd').trigger('reset');
    showView('viewEditAd');
}