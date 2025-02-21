const { Router } = require("express");

module.exports = (passport) => {
  const loginRouter = Router();

  loginRouter.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
      failureFlash: "Incorrect username or password. Please try again",
    })
  );

  loginRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.redirect("/");
      });
    });
  });

  return loginRouter;
};
