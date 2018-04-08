function loadRepos() {
    $('#repos').empty();
    $.ajax({
    // $.get({
        method: 'GET',
        url: 'https://api.github.com/users/' + $("#username").val() + '/repos',
        success: handleSuccess,
        error: handleError
    })
    function handleSuccess(res) {
        for (let repo of res) {
            $('#repos').append(
                $('<li>').append(
                    $(`<a href="${repo.html_url}">${repo.full_name}</a>`)
                )
            )
        }
        //console.log(res)
    }
    function handleError(err) {
        console.log(err)
        $('#repos').append($('<li>').text('Error'));
    }
}