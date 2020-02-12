$(document).ready(function () {

    //click event to scrape new articles
    $('#scrape').on('click', function (e) {
        console.log("scrape clicked")
        $('#loader').css({ 'display': 'block' });
        e.preventDefault();
        $.ajax({
            url: '/scrape/newArticles',
            type: 'GET',
            success: function (response) {
                $('#numArticles').text(response.count);
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result) {
                $('#loader').css({ 'display': 'none' });
            }
        });
    });

});