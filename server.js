const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

//Axios similar to Ajax methods used to pull data
const axios = require("axios");
const cheerio = require("cheerio");

//Calls the models folders
const db = require("./models");

//Opens on localhost port 3000
const PORT = 3000;

//Start Express
const app = express();

app.use(logger("dev"));
//Shows data in JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Uses Public static folder for UX
app.use(express.static("public"));

//Creates and connects to MongoDB
mongoose.connect("mongodb://localhost/scraperwk18", { useNewUrlParser: true });

//Routes
app.get("/scrape", function (re, res) {
    //Axios grabs the body of the page insterted below
    axios.get("https://www.npr.org/").then(function (response) {
        //Loads the data in the $ variable
        const $ = cheerio.load(response.data);

        //Grabs the article in the page
        $("article h3").each(function (i, element) {
            const result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });

        res.send("Scrap Complete");
    });
});
