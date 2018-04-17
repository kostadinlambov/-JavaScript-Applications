$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let source = $('#cat-template').html();
        let cardsTemplate = Handlebars.compile(source);

        let catsArr = window.cats;

        let content = {
            catsArr
        };

        let html = cardsTemplate(content);
        $('#allCats').append(html);

        attachEvents()
    }


    function attachEvents() {
        $('.btn-primary').on('click', function () {
            // console.log(this);
            // console.log($(this).parent());
            if($(this).text() === 'Show status code'){
                $(this).text('Hide status code');
            }else{
                $(this).text('Show status code');
            }

            let currentIdDiv = $($(this).parent()).find('div');

            $(currentIdDiv).toggle();
        });
    }
});
