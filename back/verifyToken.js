function verifyToken(req, res, next) {
  let token;

  if (req.body && req.body.token) {
    token = req.body.token;
  }
  else if (req.headers['token']) {
    token = req.headers['token'];
  }
  else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (token && token === "tachemania") {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = verifyToken;
