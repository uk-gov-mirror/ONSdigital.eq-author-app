const { get } = require("lodash");

const fetchData = getQuestionnaire => async (req, res, next) => {
  let result;

  try {
    result = await getQuestionnaire(
      req.params.questionnaireId,
      req.locals.accessToken
    );
  } catch (err) {
    return next(err);
  }

  const questionnaire = get(result, "data.questionnaire");

  if (!questionnaire) {
    return res.status(404).send({
      params: req.params,
      error: result.errors,
    });
  }

  req.locals.questionnaire = questionnaire;
  return next();
};

module.exports = fetchData;
