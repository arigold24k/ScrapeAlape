// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
      $("#articles").append(`<div class="divider"></div><div class='section'><p data-id="${data[i]._id}">${data[i].title}<br /><a class="articlelink" href="${data[i].link}" target=_blank>${data[i].link}</a></p></div>`)
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
        var holder = $(`<div class='section'>`);
        holder.append(`<h3>${data.title}</h3>`);
        holder.append("<div class='divider'>");
        holder.append(`<input id="titleinput" name="title" placeholder="title">`);
        holder.append(`<textarea id="bodyinput" name="body" class="materialize-textarea"></textarea>`);
        holder.append(`<a class="btn-floating btn-large waves-effect waves-light red" data-id="${data._id}" id ="savenote"><i class="material-icons">add</i></a>`);
        // holder.append(`<button data-id="${data._id}" id ="savenote">Save Note</button>`);

        $("#notes").append(holder);

        // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
