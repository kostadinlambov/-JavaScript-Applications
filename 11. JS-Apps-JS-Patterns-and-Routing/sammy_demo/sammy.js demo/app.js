$(() => {
    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        this.get('index.html', (contex) => {
            contex.swap('<h1>Hello from Sammy.js</h1>')
            contex.redirect('#/hello/:name')
        });

        this.get('#/about', function () {
            this.swap('<h1>About page</h1>')
        });

        this.get('#/contact', function () {
            this.swap('<h1>Contact page</h1>')
        });

        this.get('#/login', (ctx) => {
            ctx.swap('<form action="#/login" method="post">\n' +
                '  User: <input name="user" type="text">\n' +
                '  Pass: <input name="pass" type="password">\n' +
                '  <input type="submit" value="Login">\n' +
                '</form>\n')
        });

        this.post('#/login', (ctx) => {
            console.log(ctx.params.user);
            console.log(ctx.params.pass);

            ctx.redirect('#/contact')
        });


        this.get('#/hello/:name', (ctx)=> {
            ctx.title = 'Hello';
            ctx.name = ctx.params.name;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/greetings.hbs')
            });
        })

        this.get('#/edit', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                editForm: './templates/editForm.hbs'
            }).then(function () {
                this.partial('./templates/editPage.hbs');
                console.log('#/GET edit');
            })
        });

        // this.get('#/edit/:teamId', function (context) {
        //     console.log('#/POST edit');
        //     let name = context.params.name;
        //     let comment = context.params.comment;
        //     let teamId = context.params.teamId;
        //     console.log(name);
        //     console.log(comment);
        //     console.log(teamId);
        //     teamsService.edit(teamId, name, comment)
        //         .then(function (res) {
        //             context.redirect('#/home');
        //             console.log(res);
        //             console.log('#/POST edit response');
        //         }).catch(function (err) {
        //         // console.log(err)
        //         console.log(err.statusText)
        //     })
        // });

    });

    app.run();
});