const URL = 'https://phonebook-1b100.firebaseio.com/phonebook';
const person = $('#person');
const phone = $('#phone');

$('#btnLoad').on('click', loadData);
$('#btnCreate').on('click', postData);

function loadData() {
    $('#phonebook').empty();
    $.ajax({
        method: 'GET',
        url: URL + '.json',
    }).then(handleSuccess)
        .catch(handleError);

    function handleSuccess(res) {
        console.log(res);
        for (let key in res) {
            generateLi(res[key].person, res[key].phone, key);
        }
    }
}

function postData() {
    let name = person.val();
    let phoneVal = phone.val();

    let postData = JSON.stringify({'person': name, 'phone': phoneVal});

    $.ajax({
        method: 'POST',
        url: URL + '.json',
        data: postData,
        success: appendElement,
        error: handleError
    })

    function appendElement(res) {
        console.log(res)
        generateLi(name, phoneVal, res.name);
       person.val('');
       phone.val('');
    }
}

function generateLi(person, phone, name) {
    let li =  $(`<li>${person}: ${phone} </li>`)
        .append($('<a href="#">[Delete]</a>')
            .click(function () {
                $.ajax({
                    method:'DELETE',
                    url: URL + `/${name}.json`
                }).then(() => {$(li).remove()})
                    .catch(handleError);
            }));

    $('#phonebook').append(li)
}

function handleError(err) {
    console.log(err)
}