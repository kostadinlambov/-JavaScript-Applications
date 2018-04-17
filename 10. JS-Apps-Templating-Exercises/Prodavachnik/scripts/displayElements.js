const templates = {};
loadTemplates();

// Adding all Templates
async function loadTemplates() {
    const [adsCatalogTemplate, adPartialTemplate, headersTemplate, login_register_Template, homeViewTemplate, footer, create_edit_Template, viewAdDetailsTemplate] = await Promise.all([
        $.get('./templates/adsCatalog.hbs'),
        $.get('./templates/common/adPartialTemplate.hbs'),
        $.get('./templates/headersTemplate.hbs'),
        $.get('./templates/login_register_Template.hbs'),
        $.get('./templates/homeViewTemplate.hbs'),
        $.get('./templates/common/footer.hbs'),
        $.get('./templates/create_edit_Template.hbs'),
        $.get('./templates/viewAdDetails.hbs'),
    ]);

    templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
    templates['headers'] = Handlebars.compile(headersTemplate);
    templates['login_register'] = Handlebars.compile(login_register_Template);
    templates['homeView'] = Handlebars.compile(homeViewTemplate);
    templates['create_edit'] = Handlebars.compile(create_edit_Template);
    templates['viewDetails'] = Handlebars.compile(viewAdDetailsTemplate);

    Handlebars.registerPartial('adPartial', adPartialTemplate);
    Handlebars.registerPartial('footer', footer);
}

async function showHideMenuLinks() {
    let authToken = await sessionStorage.getItem('authToken');
    let headers = window.headers.loggedOutUserHeaders;
    if(authToken){
        headers = window.headers.loggedInUserHeaders;
    }

    let source = await $.get('./templates/headersTemplate.hbs');
    let compiled = Handlebars.compile(source);
    let html = compiled({headers});

    $('#app').html(html);

    $('#linkHome').on('click', showHomeView);
    $('#linkRegister').on('click', ['register'],showLoginRegisterView);
    $('#linkLogin').on('click', ['login'],showLoginRegisterView);
    $('#linkCreateAd').on('click',  ['create'],showCreateEditView);
    $('#linkLogout').on('click', logoutUser);
    $('#linkListAds').on('click', listAds);

    showHomeView();
}

function displayAds(ads) {
    ads.forEach(a => {
        if (a._acl.creator === sessionStorage.getItem('userId')) {
            a.isAuthor = true
        }
    });

    let sortedAds = ads.sort((a, b) => {
        return a['publisher'].localeCompare(b['publisher']);
    });

    let context = {
        sortedAds
    };

    let html = templates['catalog'](context);
    $('#content').html(html);

    $('#content').find('a.edit').on('click', ['edit'], showCreateEditView);
    $('#content').find('a.delete').on('click', deleteAd);
    $('#content').find('a.readMore').on('click', viewAdDetails);
}

async function showLoginRegisterView(event) {
    let viewType = event.data[0];
    console.log('viewType: ' + viewType);
    let data;

    let loginObj = {
        sectionId: 'viewLogin',
        titleText: 'Please login',
        formId: 'formLogin',
        buttonId: 'buttonLoginUser',
        buttonValue: 'Login'
    };

    let registerObj = {
        sectionId: 'viewRegister',
        titleText: 'Please register here',
        formId: 'formRegister',
        buttonId: 'buttonRegisterUser',
        buttonValue: 'Register'
    };

    if (viewType === 'login') {
        data = loginObj;
    } else {
        data = registerObj;
    }

    let html = templates['login_register'](data);

    $('#content').html(html);

    if (viewType === 'login') {
        $("#formLogin #buttonLoginUser").on('click', loginUser);
        $('#formLogin').trigger('reset');
    } else {
        $("#formRegister #buttonRegisterUser").on('click', registerUser);
        $('#formRegister').trigger('reset');
    }
}

function showCreateEditView(event) {
    let id = $(this).parent().parent().attr('data-id');
    let viewType = event.data[0];
    let data;

    let createObj = {
        sectionId: 'viewCreateAd',
        titleText: 'Create new Advertisement',
        formId: 'formCreateAd',
        buttonId: 'buttonCreateAd',
        buttonValue: 'Create'
    };

    let editObj = {
        sectionId: 'viewEditAd',
        titleText: 'Edit existing advertisement',
        formId: 'formEditAd',
        buttonId: 'buttonEditAd',
        buttonValue: 'Edit'
    };

    if (viewType === 'create') {
        data = createObj;
    } else {
        data = editObj;
    }

    let html = templates['create_edit'](data);
    $('#content').html(html);

    if (viewType === 'create') {
        $("#formCreateAd #buttonCreateAd").on('click', createAd);
        $('#formCreateAd').trigger('reset');
    } else {
        $("#formEditAd #buttonEditAd").on('click', editAd.bind(this));
        $('#formEditAd').trigger('reset');

        loadAdForEdit(id);
    }
}

function showHomeView() {
    let html = templates['homeView']({});
    $('#content').html(html);
}

function showInfo(message) {
    let infobox = $('#infoBox');
    infobox.text(message);
    infobox.show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 2000)
}

function showError(errMessage) {
    let errorBox = $('#errorBox');
    errorBox.text('Error: ' + errMessage);
    errorBox.show();
}

