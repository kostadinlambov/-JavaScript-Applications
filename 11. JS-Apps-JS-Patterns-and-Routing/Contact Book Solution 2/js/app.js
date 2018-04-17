const handlers = {};

$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/contacts', handlers.contacts);


        this.get('index.html', function () {
            if (auth.isAuthed()) this.loggedIn = true;
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs');
            });
        });

        this.get('#/register', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/register.hbs');
            });
        });



        this.get('#/profile', function () {
            console.log('Edit profile form');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/profile.hbs');
            });
        });

        this.get('#/logout', function () {
            console.log('Logout');
            auth.logout()
                .then(() => {
                    localStorage.clear();
                    this.redirect('#');
                });
        });

        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            auth.login(username, password)
                .then(function (data) {
                    auth.saveSession(data);
                    context.trigger('user-login');
                    context.redirect('#/contacts');
                });
        });

        this.post('#/register', function () {

            // Handle register
        });

        this.post('#/profile', function () {
            // Handle edit profile
        });
    }).run();

    // TODO
    // * user search
    // * messages
});