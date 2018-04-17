$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', loadHomeView);
        this.get('#/home', loadHomeView);

        function loadHomeView() {
            if (auth.isAuthenticated()) {
                this.loggedIn = true;
                this.username = sessionStorage.getItem('username')
            }
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/home/home.hbs')
            });
        }

        this.get('#/register', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
        });

        this.post('#/register', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let repeatPassword = context.params.repeatPassword;

            if (password === repeatPassword) {
                auth.register(username, password, repeatPassword)
                    .then(function (res) {
                        auth.saveSession(res);
                        auth.showInfo('Registration successful');
                        context.redirect('#/home')
                    }).catch(auth.handleError)
            } else {
                auth.showError('Password does not match the confirm password!')
            }

        });

        this.get('#/login', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs');
            })
        });

        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            auth.login(username, password)
                .then(function (userData) {
                    auth.showInfo('Login successful.')
                    auth.saveSession(userData);
                    context.redirect('#/home');
                }).catch(auth.handleError)
        });

        this.get('#/create', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs');
            })
        });

        this.post('#/create', function (context) {
            let name = context.params.name;
            let comment = context.params.comment;
            teamsService.createTeam(name, comment)
                .then(function (res) {
                    let teamId = res._id;
                    sessionStorage['teamId'] = teamId;
                    teamsService.joinTeam(teamId)
                        .then((res) => {
                            context.redirect('#/catalog');
                        }).catch(auth.handleError)
                }).catch(auth.handleError)
        });

        this.get('#/leave', function (context) {
            context.loggedIn = true;
            context.username = sessionStorage.getItem('username');
            teamsService.leaveTeam()
                .then(() => {
                    sessionStorage.setItem('teamId', '');
                    window.history.go(-1);
                    // context.redirect('#/catalog')
                }).catch(auth.handleError);
        });

        this.get('#/join/:teamId', function (context) {
            context.teamId = context.params.teamId;
            context.loggedIn = true;
            context.username = sessionStorage.getItem('username');
            teamsService.joinTeam(context.teamId)
                .then(() => {
                    sessionStorage.setItem('teamId', context.teamId);
                    window.history.go(-1);
                    // context.redirect('#/catalog')
                }).catch(auth.handleError);
        });

        this.get('#/catalog/:teamId', function (context) {
            context.loggedIn = true;
            context.username = sessionStorage.getItem('username');
            context.teamId = context.params.teamId;

            const loadTeamPromise = teamsService.loadTeamDetails(context.teamId);
            const getTeamMembersPromise = teamsService.getTeamMembers(context.teamId);

            Promise.all([loadTeamPromise, getTeamMembersPromise])
                .then(([teamDetails, teamMembers]) => {
                    context.name = teamDetails.name;
                    context.comment = teamDetails.comment;
                    context.isAuthor = false;
                    context.isOnTeam = false;

                    if (sessionStorage.getItem('teamId') === context.teamId) {
                        context.isOnTeam = true;
                    }
                    if (teamDetails._acl.creator === sessionStorage.getItem('userId')) {
                        context.isAuthor = true;
                    }
                    let members = [];

                    context.members = teamMembers;
                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        teamMember: './templates/catalog/teamMember.hbs',
                        teamControls: './templates/catalog/teamControls.hbs',
                    }).then(function () {
                        this.partial('./templates/catalog/details.hbs')
                    })
                }).catch(auth.handleError)
        });

        this.get('#/catalog', function (context) {
            context.username = sessionStorage.getItem('username');
            teamsService.loadTeams()
                .then(function (res) {
                    context.teams = res;
                    console.log('context.teams#############')
                    console.log(res)
                    context.loggedIn = true;
                    context.hasNoTeam = true;
                    res.forEach(team => {
                        if (team._acl.creator === sessionStorage.getItem('userId')) {
                            context.hasNoTeam = false;
                        }
                    });
                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        team: './templates/catalog/team.hbs',
                    }).then(function () {
                        this.partial('./templates/catalog/teamCatalog.hbs')
                    })
                }).catch(auth.handleError)
        });

        this.get('#/edit/:teamId', function (context) {
            console.log('get(\'#/edit/:teamId)#################');
            context.loggedIn = true;
            context.username = sessionStorage.getItem('username');

            let teamId = context.params.teamId;
            context.teamId = context.params.teamId;
            teamsService.loadTeamDetails(teamId)
                .then(function (res) {
                    console.log(res)
                    context.name = res.name;
                    context.comment = res.comment;

                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        editForm: './templates/edit/editForm.hbs'
                    }).then(function () {
                        this.partial('./templates/edit/editPage.hbs');
                        // context.redirect('#/catalog');
                    })

                }).catch(auth.handleError)
        });

        this.post('#/edit/:teamId', function (context) {
            context.loggedIn = true;
            this.username = sessionStorage.getItem('username');

            context.teamId = context.params.teamId;
            context.name = context.params.name;
            context.comment = context.params.comment;

            teamsService.edit(context.teamId, context.name, context.comment)
                .then(function (res) {
                    context.redirect('#/catalog');
                }).catch(auth.handleError)
        });

        this.get('#/about', function () {
            if (auth.isAuthenticated()) {
                this.loggedIn = true;
                this.username = sessionStorage.getItem('username')
            }
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/about/about.hbs');
            })
        });

        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo('Logout successful.');
                    context.redirect('#/home')
                })
        });

    });

    app.run();
});