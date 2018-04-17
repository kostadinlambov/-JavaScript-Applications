handlers.contacts = function (ctx) {
    if (!auth.isAuthed()) this.redirect('#');
    else ctx.loggedIn = true;
    $.get('data.json').then(data => {
        ctx.contacts = data;
        ctx.selected = null;

        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            contact: './templates/common/contact.hbs',
            contact_list: './templates/common/contactList.hbs',
            contact_details: './templates/common/details.hbs',
        }).then(function () {
            ctx.partials = this.partials;
            render();
        });
    });

    function render() {
        ctx.partial('./templates/contacts.hbs')
            .then(attachEventHandlers);
    }

    function attachEventHandlers() {
        $('.contact').click((e) => {
            let index = $(e.target).closest('.contact').attr('data-id');
            ctx.contacts.forEach(c => c.active = false);
            ctx.contacts[index].active = true;
            ctx.selected = ctx.contacts[index];
            render();
        });
    }
};