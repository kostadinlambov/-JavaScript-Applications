let notify = (() => {

    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.find('span').text(message);
        infoBox.fadeIn();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.find('span').text(message);


        errorBox.fadeIn();
        $(errorBox).on('click',  function () {
            errorBox.fadeOut();
        })
    }

    function handleError(reason) {
        if(reason.responseJSON){
            showError(reason.responseJSON.description);
        }else{
            showError(reason.message);
        }
    }

    return {
        showInfo,
        showError,
        handleError
    }
})();

