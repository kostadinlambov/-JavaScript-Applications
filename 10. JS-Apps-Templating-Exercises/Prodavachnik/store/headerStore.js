(function () {
    class Header {
        constructor(id, text) {
            this.id = id;
            this.text = text;
        }
    }

    let loggedOutUserHeaders = [
        new Header('linkHome', 'Home'),
        new Header('linkLogin', 'Login'),
        new Header('linkRegister', 'Register'),
    ];

    let loggedInUserHeaders = [
        new Header('linkHome', 'Home'),
        new Header('linkListAds', 'List Advertisements'),
        new Header('linkCreateAd', 'Create Adv'),
        new Header('linkLogout', 'Logout'),
    ];

    window.headers = {
        loggedInUserHeaders,
        loggedOutUserHeaders
    };

})();