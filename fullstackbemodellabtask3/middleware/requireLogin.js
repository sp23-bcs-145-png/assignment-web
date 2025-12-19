// middleware/requireLogin.js
module.exports = function requireLogin(req, res, next) {
  if (!req.session.admin) return res.redirect("/login");
  next();
};
