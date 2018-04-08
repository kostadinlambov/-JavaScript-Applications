function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_SJRK1QtcG/books/';
    const USERNAME = 'pesho';
    const PASSWORD = 'p';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const AUTH = {'Authorization': 'Basic ' + BASE_64};

    createTable();

    class Book {
        constructor(title, author, isbn, id) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.isbn = isbn;
            this._element = this.addBook()
        }

        addBook() {
            let trBody = $('<tr>');
            let tdTitle = $('<td>').append($(`<input type="text" class="title" value="${this.title}"/>`));
            let tdAuthor = $('<td>').append($(`<input type="text" class="author" value="${this.author}"/>`));
            let tdISBN = $('<td>').append($(`<input type="number" class="isbn" value="${this.isbn}"/>`));

            let tdButtons = $('<td>');
            // let deleteBtn = $('<button>Delete</button>').on('click', deleteBook.bind(this, this.id, trBody));
            let deleteBtn = $('<button>Delete</button>').on('click', this._deleteBook.bind(this, this.id, trBody));
            // let editBtn = $('<button>Edit</button>').click([this.id], editBooks);
            let editBtn = $('<button>Edit</button>').click([this.id], this._editBooks);

            tdButtons.append(editBtn);
            tdButtons.append(deleteBtn);
            trBody.append(tdTitle);
            trBody.append(tdAuthor);
            trBody.append(tdISBN);
            trBody.append(tdButtons);

            return trBody
        }

        _deleteBook(id, trbody) {
            trbody.remove();
            $.ajax({
                method: 'DELETE',
                url: URL + this.id,
                headers: AUTH,
            }).then(function (res) {
                console.log(res)
            }).catch(function (err) {
                console.log(err)
            })
        }

        _editBooks(event) {
            let title = $($(this).parent().parent().find('.title')).val();
            let author = $($(this).parent().parent().find('.author')).val();
            let isbn = $($(this).parent().parent().find('.isbn')).val();

            let body = {
                title: title,
                author: author,
                isbn: isbn
            };

            $.ajax({
                method: 'PUT',
                url: URL + this.id,
                headers: AUTH,
                data: JSON.stringify(body),
                contentType: 'application/json',
            }).then(function (res) {
                // loadCatches()
                console.log('RES:')
                console.log(res)
            }).catch(function (err) {
                console.log(err)
            })
        }

        render() {
            $('#booksTable tbody').append($(this._element))

        }
    }


    function createAndRenderNewBook(title, author, isbn, id) {
        let book = new Book(title, author, isbn, id);
        book.render()
    }

    function request(method, id, body) {
        // Construct request, using the passed in parameters
        return $.ajax({
            method: method,
            url: URL + id,
            headers: AUTH,
            data: JSON.stringify(body),
            contentType: 'application/json',
        });
    }

    function takeInputValues(event) {
        let title = $(event.data[0]).find("[name='title']").val();
        let author = $(event.data[0]).find("[name='author']").val();
        let isbn = $(event.data[0]).find("[name='isbn']").val();

        let body = {
            title: title,
            author: author,
            isbn: isbn
        };

        request('POST', '', body)
            .then(function (res) {
                createAndRenderNewBook(res.title, res.author, res.isbn, res._id)
            }).catch(function (err) {

        });

        $(event.data[0]).find("[name='title']").val('');
        $(event.data[0]).find("[name='author']").val('');
        $(event.data[0]).find("[name='isbn']").val('');
    }

    function loadBooks() {
        request('GET', '', {})
            .then(function (res) {
                $('#booksTable tbody').empty();
                for (let book of res) {
                    createAndRenderNewBook(book.title, book.author, book.isbn, book._id)
                }
            }).catch(function (err) {
            console.log(err)
        })
    }

    function createTable() {
        let table = $('<table>');
        let caption = $('<caption>').text(`Books List`);

        let thead = $('<thead>');
        let trHead = $('<tr>');
        let thName = $('<th>').text('Title').addClass('title');
        let thCategory = $('<th>').text('Author').addClass('author');
        let thPrice = $('<th>').text('ISBN').addClass('isbn');
        let thActions = $('<th>').append($('<button>Load all Books</button>').click(loadBooks))
        // let thActions = $('<th>').text('Actions');

        trHead.append(thName);
        trHead.append(thCategory);
        trHead.append(thPrice);
        trHead.append(thActions);
        thead.append(trHead);

        table.append(caption);
        table.append(thead);

        let tbody = $('<tbody>').addClass('payments');

        table.append(tbody);

        let tfoot = $('<tfoot>');
        let trFoot = $('<tr>');

        let tdNameFoot = $('<td>');
        let nameInput = $('<input>').prop('name', 'title').prop('type', 'text');

        let tdCategoryFoot = $('<td>');
        let categoryInput = $('<input>').prop('name', 'author').prop('type', 'text');

        let tdPriceFoot = $('<td>');
        let priceInput = $('<input>').prop('name', 'isbn').prop('type', 'number');

        let tdButton = $('<td>');
        let addBtn = $('<button>').text('Add').on('click', [trFoot], takeInputValues);


        tdNameFoot.append(nameInput);
        trFoot.append(tdNameFoot);

        tdCategoryFoot.append(categoryInput);
        trFoot.append(tdCategoryFoot);

        tdPriceFoot.append(priceInput);
        trFoot.append(tdPriceFoot);

        tdButton.append(addBtn);
        trFoot.append(tdButton);

        tfoot.append(trFoot);


        table.append(tfoot);

        $('#booksTable').append($(table))
        // $('body').append($(trLoadAllBtn))
        return table
    }
}

attachEvents();