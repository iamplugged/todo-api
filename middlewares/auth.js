const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token == null) return res.sendStatus(403);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof user.id === 'undefined') {
      throw new Error();
    }
    req.userId = user.id;
    next();
  } catch (e) {
    res.sendStatus(401);
  }
}

module.exports = validateToken;
