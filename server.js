const express = require('express');
const fs = require('fs');
const path = require('path');
const { clog } = require('./middleware/clog');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(clog);

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(express.static('public'));

function newNote(body) {
    const note = body;
    let currentNotes = fs.readFileSync(`./'db/db.json`);
    currentNotes = JSON.parse(currentNotes);
    currentNotes.push(note);
    fs.writeFileSync(path.join(__dirname, `./db/db.json`),
        JSON.stringify(currentNotes, null, 2)
    );
    return note;
}
function checkNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return false;
}

app.get('/api/notes', (req, res) => {
    let results = fs.readFileSync(`./db/db.json`);
    results = JSON.parse(results);
    res.json(results);
});

app.post(`/api/notes`, (req, res) => {
    req.body.id = short.uuid();
    if (!checkNote(req.body)) {
        res.status(400).send(`please provide a title and task`);
    } else {
        const note = newNote(req.body);
        res.json(note);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`now listening on ${PORT}`);
});
