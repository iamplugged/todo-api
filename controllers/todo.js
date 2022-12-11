const Todo = require('../models').Todo;

module.exports = {
  listTodos: async (req, res) => {
    try {
      const todos = await Todo.findAll({
        where: {
          userId: req.userId
        },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'complete']
      });
  
      res.json(todos);
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ message: e.message });
    }
  },

  createTodo: async (req, res) => {
    try {
      const { id, title, complete } = await Todo.create({
        title: req.body.title,
        userId: req.userId
      });
      res.json({
        id,
        title,
        complete
      });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  },

  updateTodo: async (req, res) => {
    try {
      await Todo.update({ complete: req.body.complete }, {
        where: {
          id: req.params.id
        }
      });

      const todo = await Todo.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'title', 'complete']
      });

      res.json(todo);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      await Todo.destroy({
        where: {
          id: req.params.id
        }
      });

      res.status(200).send();
      
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }
};