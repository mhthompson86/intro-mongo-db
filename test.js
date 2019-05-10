const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan');
const {urlencoded, json} = require('body-parser');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    minlength: 10
  }
});

const Note = mongoose.model('note', noteSchema);

app.use(morgan('default'));
app.use(urlencoded({extended: true}));
app.use(json());


app.get('/notes', async (req, res) => {
  const notes = await Note.find({})
    .lean() // just give me the stuff, not the extra mongoose stuff as well
    .exec();
  res.status(200).json(notes);
});

app.post('/notes', async (req, res) => {
  const noteToBeCreated = req.body;
  const note = await Note.create(noteToBeCreated);
  res.status(201).json(note);
});

const connect = () => {
  return mongoose.connect('mongodb://localhost:27017/whatever',
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
};


connect()
  .then(async connection => {

    app.listen(5000);

    console.log('listening on port 5000');

    //return mongoose.disconnect();
  })
  .catch(e => console.error(e));
