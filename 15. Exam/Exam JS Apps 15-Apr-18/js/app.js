$(() => {
    let app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/homeAnonymous', getWelcomePage);
        this.get('index.html', getWelcomePage);

        function getWelcomePage(context) {
            if (!auth.isAuth()) {
                context.loadPartials({
                    footer: './templates/common/footer.hbs',
                    loginForm: './templates/forms/loginForm.hbs',
                    registerForm: './templates/forms/registerForm.hbs',

                }).then(function () {
                    this.partial('./templates/homeView/homeAnonymous.hbs');
                })
            } else {
                context.redirect('#/homeScreen');
            }
        }


        this.post('#/register', function (ctx) {
            if (!auth.isAuth()) {
                let username = ctx.params['username-register'];
                let password = ctx.params['password-register'];
                let repeatPass = ctx.params['password-register-check'];

                if (typeof username !== 'string' || username.length < 5) {
                    notify.showError('Username must be a string and at least 5 character long.')
                } else if (password === '') {
                    notify.showError('Password fields shouldn’t be empty.')
                } else if (password !== repeatPass) {
                    notify.showError('Password and Repeat Password should match.')
                } else {
                    auth.register(username, password)
                        .then(function (res) {
                            console.log('register res##############');

                            notify.showInfo('User registration successful.');
                            auth.saveSession(res);
                            ctx.redirect('#/homeScreen')
                        }).catch(notify.handleError)
                }
            } else {
                ctx.redirect('#/homeScreen');
            }
        });

        this.post('#/login', (ctx) => {
            if (!auth.isAuth()) {
                let username = ctx.params['username-login'];
                let password = ctx.params['password-login'];

                if (typeof username !== 'string' || username.length < 5) {
                    notify.showError('Username must be a string and at least 5 character long.')
                } else if (password === '') {
                    notify.showError('Password field shouldn’t be empty.')
                } else {
                    auth.login(username, password)
                        .then((userData) => {
                            auth.saveSession(userData);
                            notify.showInfo('Login successful.');
                            ctx.redirect('#/homeScreen');
                        })
                        .catch(notify.handleError);
                }
            } else {
                ctx.redirect('#/homeAnonymous');
            }
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    ctx.redirect('#/homeAnonymous');
                })
                .catch(notify.handleError);
        });

        this.get('#/homeScreen', getEditReceiptPage);
        this.get('#/editReceipt', getEditReceiptPage);

        function getEditReceiptPage(ctx) {
            console.log('ctx#############################');
            console.log(ctx);
            let userId = sessionStorage.getItem('userId');
            let username = sessionStorage.getItem('username');

            receiptService.getActiveReceipt(userId)
                .then(function (res) {
                    console.log('active Receipt################');
                    if (res.length === 0) {
                        console.log('No active Receipt################');
                        receiptService.createReceipt()
                            .then(function (createdReceipt) {
                                console.log('createdReceipt#############')
                                window.history.go(-1);
                            }).catch(notify.handleError)
                    } else {
                        ctx.isAuth = true;
                        ctx.username = username;

                        let receiptId = res[0]._id;
                        sessionStorage.setItem('receiptId', `${receiptId}`);

                        entryService.getEntriesByReceiptId(receiptId)
                            .then(function (entriesById) {
                                console.log('entriesById###############')
                                let total =0;
                                entriesById.forEach(e => {
                                    let subtotal = e.qty * e.price;
                                    console.log(subtotal)
                                    e.subTotal = subtotal;
                                    total += subtotal;
                                });
                                ctx.total = total;
                                ctx.entries = entriesById;
                                ctx.loadPartials({
                                    footer: './templates/common/footer.hbs',
                                    navigation: './templates/common/navigation.hbs',
                                    createReceiptForm: './templates/editReceipt/createReceiptForm.hbs',
                                    createEntryForm: './templates/editReceipt/createEntryForm.hbs',
                                }).then(function () {
                                    this.partial('./templates/editReceipt/editReceipt.hbs');
                                })
                            })
                    }
                }).catch(notify.handleError)
        }

        this.post('#/create/entry', function (ctx) {
            ctx.isAuth = true;
            console.log('#/create/entry###########');
            let type = ctx.params.type;
            let qty = ctx.params.qty;
            let price = ctx.params.price;
            let receiptId = sessionStorage.getItem('receiptId')

            if (typeof type !== 'string' || type.length === 0) {
                notify.showError('Product name must be a non-empty string')
            } else if (isNaN(qty) || qty === '') {
                notify.showError('Quantity must be a number.')
            } else if (isNaN(price) || price === '') {
                notify.showError('Price must be a number.')
            } else {
                entryService.addEntry(type, qty, price, receiptId)
                    .then(function (res) {
                        notify.showInfo('Entry added')
                        ctx.redirect('#/homeScreen')
                    }).catch(notify.handleError)

            }
        })

        this.get('#/delete/entry/:entryId', (ctx) => {

            if (!auth.isAuth()) {
                ctx.redirect('#/homeAnonymous');
                return;
            }

            let entryId = ctx.params.entryId;

            entryService.deleteEntry(entryId)
                .then(function() {
                    notify.showInfo('Entry removed.');
                    ctx.redirect('#/homeScreen');
                }).catch(notify.handleError);
        });


        this.post('#/create/receipt' , function (ctx) {

           let userId =  sessionStorage.getItem('userId')

            receiptService.getActiveReceipt(userId)
                .then(function (context) {
                    console.log(context)

                    let productCount = context.params.productCount;
                    let total = context.params.total;
                    receiptService.commitReceipt(productCount, total)
                        .then(function () {
                            notify.showInfo('Receipt checked out');


                            ctx.redirect('#/homeScreen');

                        }).catch(notify.handleError);

                }).catch(notify.handleError);

        })
    });

    app.run();

});