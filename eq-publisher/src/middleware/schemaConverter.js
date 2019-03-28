module.exports = converter => (req, res, next) => {
  converter
    .convert(req.locals.questionnaire)
    .then(questionnaire => {
      req.locals.questionnaire = questionnaire;
      next();
    })
    .catch(err => next(err));
};
