const express = require("express");
const app = express();
//const Auth0Strategy = require('passport-auth0');

//const strategy = new Auth0Strategy({
//	state: false
//},
//function(accessToken, refreshToken, extraparams, profile, done) {

//});

// app.get('/login', passport.authentivate('auth0', {scope: 'openid email profile'}),
//	function (req, res) {
//		res.redirect('/');
//});

app.use(express.static(__dirname + '/client'));

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");

const mongooseUri = "mongodb+srv://movieDatabaseLite:mBl349@moviedatabase.8edackh.mongodb.net/movieCRUD";
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true});
const movieSchema = {
	title: String,
	comments: String
};
const Movie = mongoose.model("movie", movieSchema);

app.post("/create", function(req, res){
	let newNote = new Movie({
		title: req.body.title,
		comments: req.body.comments
	});
	
	newNote.save();
	res.redirect("/");
});

const renderNotes = (notesArray) => {
	let text = "Movies Collection:\n\n";
	notesArray.forEach((note)=>{
		text += "Title: " + note.title  + "\n";
		text += "Comments: " + note.comments  + "\n";
		text += "ID:" + note._id + "\n\n";
	});
	text += "Total Count: " + notesArray.length;
	return text;
};

app.get("/read", function(request, response) {
	Movie.find({}).then(notes => { 
		response.type('text/plain');
		response.send(renderNotes(notes));
	});
});

app.post("/update", function updateListingByName(client, nameOfListing, updatedListing, res){
	client.db("movieCRUD").collection("movies").updateOne({ title: nameOfListing }, {$set: updatedListing });
	res.redirect("/");
});

app.delete("/delete", function(req, res) {
	Movie.deleteOne({title: req.body.title});
	res.redirect("/");
});

// Todo: Implement your own MongoDB Atlas Organization, Project, Database Cluster, Database, and Collection.
// Todo: Implement and test the Update and Delete functionCRUD.

// End MongoDB Atlas *******

const port = process.env.PORT || 3000;
app.get('/test', function(request, response) {
	response.type('text/plain');
	response.send('Node.js and Express running on port='+port);
});

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/");
});