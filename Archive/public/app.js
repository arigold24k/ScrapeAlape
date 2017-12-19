$.getJSON("/articles", function(data) {
    for (let i = 0; i < 20; i++) {
        $("#articles").append(`<div class="divider"></div>`)
        $("#articles").append(`<div class="section"><p data-id="${data[i]._id}">${data[i].title}<br />${data[i].link}</p></div>`)
    }
});


$(document).on("click", "p", function() {
    $("#notes").empty();
    const thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/article/" + thisId
    }).done(function(data) {
        console.log(data);

        var holder = $(`<div class='section'>`);
        holder.append(`<h2>${data.title}</h2>`);
        holder.append(`<input id="titleinput" name="title">`);
        holder.append("<div class='divider'>");
        holder.append(`<textarea id="bodyinput" name="body"></textarea>`);
        holder.append(`<button data-id="${data._id}" id ="savenote">Save Note</button>`);
        $("#notes").append(holder);

        if (data.note) {
         $("#titleinput").val(data.note.title);
         $("#bodyinput").val(data.note.body);
        }
    })
});

$(document).on("click", "#savenote", function() {
    const thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).done(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});