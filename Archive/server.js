var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

//when deploying to heroku need to change the port
var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));


mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18ScrapAlapa",{ useMongoClient: true });

//stating routtes

app.get("/scrape", function(req, res) {
    axios.get("http://www.echojs.com/").then(function(response) {

        // console.log(response.data);

        let $ = cheerio.load(response.data);


        $("article section").each(function(i, element) {
            var stuff = {};
            stuff.title = $(this).children("h1").text();
            stuff.link = $(this).children("a").attr("href");
            stuff.summary = $(this).children("p").text();

            db.Article.create(stuff).then(function(dbArticle) {
                res.send("Scrape Complete");
            }).catch(function(err) {
                res.json(err);
            });
        });
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    })
});

app.get("/articles/:id", function(err, res) {
    db.Note.findOne({_id: req.params.id}).populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function(err) {
    console.log(`App Listening on ${PORT} !`)
});

