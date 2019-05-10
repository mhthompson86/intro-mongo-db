const express = require('express');
const morgan = require('morgan');
const connect = require('../connect');
const { json, urlencoded } = require('body-parser');
const app = express();
const Todo = require('./todo');

app.use(morgan('default'));
app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/todo/:id', async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await Todo.findById(todoId).lean().exec();
    res.status(200).json(todo);
  } catch(e) {
    res.status(500).send({ error: 'You done messed up A-A-Ron!'});
  }

});

app.get('/todos', async (req, res) => {
  try {
    res.status(200).json(await Todo.find({}).lean().exec());
  } catch(e) {
    res.status(500).send();
  }
});

app.post('/todo', async (req, res) => {
  try {
    const todo = await Todo.create(req.body.todo);
    res.status(201).json(todo.toJSON());
  } catch(e) {
    res.status(500).send();
  }
});

app.patch('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body.update, {new: true});
    res.status(200).json(todo.toJSON());
  } catch(e) {
    res.status(500).send();
  }
});

connect('mongodb://localhost:27017/todos')
  .then(() => app.listen(4000, () => {
    console.log('server on http://localhost:4000');
  }))
  .catch(e => console.error(e));
