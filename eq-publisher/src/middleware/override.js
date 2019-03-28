const { pick } = require("lodash/fp");

const overridable = ["form_type", "theme", "legal_basis"];

module.exports = function override(req, res, next) {
  const questionnaire = req.locals.questionnaire;

  if (!questionnaire) {
    throw Error("Questionnaire not supplied on req.locals");
  }

  const overrides = req.body || {};

  req.locals.questionnaire = {
    ...questionnaire,
    ...pick(overridable, overrides),
  };

  next();
};
