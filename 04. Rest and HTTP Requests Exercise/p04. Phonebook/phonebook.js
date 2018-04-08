function attachEvents() {
    $('#btnLoad').on('click',loadData);
    $('#btnCreate').on('click',postData);

    function loadData() {
        $('#phonebook').empty();
        $.ajax({
            method: 'GET',
            url: 'https://phonebook-1b100.firebaseio.com/phonebook.json',
            success: appendElement,
            error: handleError
        });

        function appendElement(res) {
            for (let key in res) {
                let name = res[key].person;
                let phoneNum = res[key].phone;
                // console.log(name)
                // console.log(phoneNum)
                let li = $('<li>').text(`${name}: ${phoneNum} `);
                li.append($('<button>').text('[Delete]').on('click', deleteElement.bind(this, key)));
                $('#phonebook').append(li)
            }
        }

        function deleteElement(key) {
            $.ajax({
                method: 'DELETE',
                url: `https://phonebook-1b100.firebaseio.com/phonebook/${key}.json`,
                success: loadData,
                error: handleError
            })
        }
    }

    function postData() {
        let personName = $('#person').val();
        let personPhone = $('#phone').val();

        let postData = JSON.stringify({
            "person": personName,
            "phone": personPhone,
        });

        $.ajax({
            method: 'POST',
            url: 'https://phonebook-1b100.firebaseio.com/phonebook.json',
            data: postData,
            success: loadData,
            error: handleError
        })

        $('#person').val('');
        $('#phone').val('');
    }

    function handleError(res) {
        console.log(err)
    }
}
