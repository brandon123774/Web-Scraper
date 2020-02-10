$(document).ready(function () {

    //click event to scrape new articles
    $('#scrape').on('click', function (e) {
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
                $('#alertModal').modal('show');
            }
        });
    });

    //click event to save an article
    $(document).on('click', '#saveArticle', function (e) {
        let articleId = $(this).data('id');
        $.ajax({
            url: '/articles/save/' + articleId,
            type: 'GET',
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });

    //click event to delete an article from savedArticles
    $('.deleteArticle').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            url: '/articles/deleteArticle/' + id,
            type: 'DELETE',
            success: function (response) {
                window.location.href = '/articles/viewSaved';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });

});