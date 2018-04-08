function attachAllEvents() {
    // Bind the navigation menu links
    $('#linkHome').on('click', showHomeView);
    $('#linkRegister').on('click', showRegisterView);
    $('#linkLogin').on('click', showLoginView);
    $('#linkCreateAd').on('click', showCreateAdView);
    $('#linkLogout').on('click', logoutUser);

    $('#linkListAds').on('click', listAds);

    // Bind the form submit buttons
    $("#formLogin #buttonLoginUser").on('click', loginUser);
    $("#formRegister #buttonRegisterUser").on('click', registerUser);
    $("#formCreateAd #buttonCreateAd").on('click', createAd);
    $("#formEditAd #buttonEditAd").on('click', editAd);
    $("#viewDetailsAd").on('click', viewAdDetails);
    // $("form").on('submit', function(event) { event.preventDefault() })

    // Bind the info / error boxes
    $("#infoBox, #errorBox").on('click', function() {
        $(this).fadeOut()
    })

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    })

}