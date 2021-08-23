// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT||3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

// API GET Requests  
const notes = require('./db/db.json');
app.get('/api/notes', (req, res) => res.json(notes));
   
// API POST Requests
app.post('/api/notes', (req, res) => {
    notes.push(req.body);
    let id = 1;
    notes.forEach((note)=>{
        note.id = id;
        id++;
        return notes;
    });
    res.json(true);
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
    });
    res.end();
});

app.delete('/api/notes/:id', function(req, res) {
    const deleteNote = req.params.id;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === Number(deleteNote)) {
          notes.splice(i,1);
        };
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
      });
    res.end();
}});


// HTML GET Requests  
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'))
});
    
// If no matching route is found default to home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'))
});