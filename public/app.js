//click event to scrape new articles
$('#scrape').on('click', function () {
    console.log("scrape clicked");
    $.ajax({
        method: 'GET',
        url: '/scrape',
    }).done(function (data) {
        window.location = "/"
    })
});

//save articles
$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function (data) {
        window.location = "/"
    })
});

