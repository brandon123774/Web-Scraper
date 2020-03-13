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
        method: "PUT",
        url: "/articles/save/" + thisId
    }).done(function (data) {
        window.location.reload()
    })
});


//saved articles page
$("#savedarticles").on("click", function () {

    $.ajax({
        method: "GET",
        url: "/saved/" 
    }).done(function (data) {
        document.write(data)
    })
});

//delete from saved page
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/delete/" + thisId
    }).then(function(data) {
        window.location = "/"
    })
});