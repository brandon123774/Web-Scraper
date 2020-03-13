//click event to scrape new articles
$('#scrape').on("click", function () {
    console.log("scrape clicked");
    $.ajax({
        method: 'GET',
        url: '/scraped',
    }).done(function (data) {
        window.location = "/"
    })
});

//save articles
$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "saved/" + thisId
    }).done(function (data) {
        window.location.reload()
    })
});

// delete button for saved
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/delete/" + thisId
    }).then(function(data) {
        window.location = "/"
    })
});


// //save articles
// $("#savedarticles").on("click", function () {

//     $.ajax({
//         method: "GET",
//         url: "/saved/" 
//     }).done(function (data) {
//         document.write(data)
//     })
// });
