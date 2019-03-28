/* eslint-disable camelcase */
const override = require("./override");

const questionnaire = {
  id: 1,
  form_type: "0001",
  title: "test questionnaire",
  theme: "default",
};

function buildRequest(body) {
  return {
    locals: {
      questionnaire,
    },
    body,
  };
}

describe("override", () => {
  let res, next;

  beforeEach(() => {
    res = jest.fn();
    next = jest.fn();
  });

  it("should apply not change data when no override", () => {
    const req = buildRequest();
    override(req, res, next);
    expect(req.locals.questionnaire).toMatchObject(questionnaire);
  });

  it("should allow overriding form type", () => {
    const req = buildRequest({
      form_type: "0003",
    });

    override(req, res, next);

    expect(req.locals.questionnaire).toMatchObject({
      ...questionnaire,
      form_type: "0003",
    });
  });

  it("should allow overriding the theme", () => {
    const req = buildRequest({
      theme: "NI",
    });

    override(req, res, next);

    expect(req.locals.questionnaire).toMatchObject({
      ...questionnaire,
      theme: "NI",
    });
  });

  it("should allow overriding the legal basis", () => {
    const req = buildRequest({
      legal_basis: "Voluntary",
    });

    override(req, res, next);

    expect(req.locals.questionnaire).toMatchObject({
      ...questionnaire,
      legal_basis: "Voluntary",
    });
  });

  it("should not allow overriding the title", () => {
    const req = buildRequest({
      title: "changed",
    });

    override(req, res, next);

    expect(req.locals.questionnaire).toMatchObject(questionnaire);
  });

  it("should throw error when questionnaire not passed in", () => {
    expect(() =>
      override(
        {
          locals: {},
        },
        res,
        next
      )
    ).toThrowError();
  });

  it("should call next middleware", () => {
    const req = buildRequest();
    override(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
