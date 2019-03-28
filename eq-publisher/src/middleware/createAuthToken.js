const jwt = require("jsonwebtoken");
const uuid = require("uuid");

module.exports = (req, res, next) => {
  const token = jwt.sign(
    {
      user_id: "Publisher",
      name: "Publisher",
      email: "eq.team@ons.gov.uk",
      picture: "",
    },
    uuid.v4()
  );

  req.locals = {
    accessToken: token,
  };
  next();
};
