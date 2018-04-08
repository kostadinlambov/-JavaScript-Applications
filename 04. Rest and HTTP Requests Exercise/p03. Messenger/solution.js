function attachEvents() {
    let submitBtn = $('#submit');
    let refreshBtn = $('#refresh');

    submitBtn.on('click', submit);
    refreshBtn.on('click', refresh);

    function submit() {
        $('#messages').val('');
        let nameInputText = $('#author').val();
        let messageInputText = $('#content').val();
        let timestamp = Date.now();

        let postData = JSON.stringify({
            "author": nameInputText,
            "content": messageInputText,
            "timestamp": timestamp
        })

        $.ajax({
            method: 'POST',
            url: 'https://messenger-61554.firebaseio.com/.json',
            data: postData,
            success: refresh,
            error: handleError
        })
    }

    function refresh() {
        $.ajax({
            method: 'GET',
            url: 'https://messenger-61554.firebaseio.com/.json',
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(res) {
            let result = '';
            Object.keys(res).sort((a, b) => res[a].timestamp > res[b].timestamp)
                .forEach(elementId => {
                    result += `${res[elementId].author}: ${res[elementId].content}\n`
                });

            // $('#messages').text(result)
            $('#messages').val(result)
        }
    }

    function handleError(err) {
        $('#author').val('');
        $('#content').val('');
    }
}