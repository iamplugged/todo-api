const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models').User;

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
  createUser: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      if (user) {
        res.status(400).send({
          code: 'DUPLICATE_USER',
          message: 'User is already registered'
        });
      } else {
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8)
        });

        const token = generateAccessToken(user.id);
        res.status(200).send({
          id: user.id,
          name: user.name,
          token
        });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ message: e.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!user) {
        return res.status(400).send({
          code: 'INVALID_USER_OR_PASSWORD',
          message: 'Invalid email or password'
        });
      }

      const isPassCorrect = bcrypt.compareSync(req.body.password, user.password);
      if (!isPassCorrect) {
        return res.status(400).send({
          code: 'INVALID_USER_OR_PASSWORD',
          message: 'Invalid email or password'
        });
      }

      const token = generateAccessToken(user.id);
      res.status(200).send({
        id: user.id,
        name: user.name,
        token
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ message: e.message });
    }
  }
};