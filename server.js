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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const notes = JSON.parse(data);
            const newNote = req.body;
            newNote.id = Date.now().toString();
            ; notes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                } else {
                    res.status(200).json(newNote);
                }
            });
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter((note) => note.id !== req.params.id);
            fs.writeFile('./db.json', JSON.stringify(notes, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
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
